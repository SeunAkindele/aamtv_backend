const crypto = require('crypto');
const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const otpToken = require('../utils/otpToken');
const AppError = require('../utils/appError');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us your name']
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        country: {
            type: String,
            required: [true, 'Please provide your country']
        },
        phone: {
            type: String,
            required: [true, 'Please provide your phone number']
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minLength: 8,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                // This only works with CREATE and SAVE
                validator: function(el) {
                    return el === this.password;
                },
                message: 'Passwords are not the same!'
            }
        },
        passwordChangedAt: {
            type: Date,
            default: Date.now()
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        expiredAt: {
            type: Date,
            default: Date.now()
        },
        disabled: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: ['user', 'artist', 'admin'],
            default: 'user'
        },
        photo: {
            type: String,
            validate: {
                // This only works with CREATE and SAVE
                validator: function() {
                    return this.role !== 'artist' || (this.role === 'artist' && this.photo);
                },
                message: 'Please upload your photo'
            }
        },
        skill: {
            type: String,
            validate: {
                // This only works with CREATE and SAVE
                validator: function() {
                    return this.role !== 'artist' || (this.role === 'artist' && this.skill);
                },
                message: 'Please provide your skill'
            }
        },
        introduction: {
            type: String,
            validate: {
                // This only works with CREATE and SAVE
                validator: function() {
                    return this.role !== 'artist' || (this.role === 'artist' && this.introduction);
                },
                message: 'Please tell us just a little about yourself'
            }
        },
        expired: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: true
        },
        verified: {
            type: Boolean,
            default: false
        },
        verificationResetToken: String,
        verificationResetExpires: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});


// Embedding artists into user
// userSchema.pre('save', async function(next) {
//     const artistsPromises = this.artists.map(async id => User.findById(id));
//     this.artists = await artistsPromises;
//     next();
// });

userSchema.virtual('followers', {
    ref: 'Follower',
    foreignField: 'artist',
    localField: '_id',
    count: true
});

userSchema.virtual('videos', {
    ref: 'Video',
    foreignField: 'user',
    localField: '_id',
    count: true
});

// userSchema.virtual('following', {
//     ref: 'Follower',
//     foreignField: 'artist',
//     localField: '_id',
// });

// current user document being queried has access to this function
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.correctOTP = async function(candidateOTP, userOTP) {
    return await bcrypt.compare(candidateOTP, userOTP);
};

userSchema.methods.checkActive = function() {
    if(!this.active || this.disabled) {
        return true;
    } 

    return false;
};

// userSchema.post(/^find/, function(doc, next) {
    
//     next();
// });

// checking if password has been changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = otpToken();

    this.passwordResetToken = await bcrypt.hash(resetToken, 12);
  
    // setting the password reset to expire in 10min
    this.passwordResetExpires = Date.now() + 5 * 60 * 1000;

    return resetToken;
};

userSchema.methods.createVerificationResetToken = async function() {
    const verificationToken = otpToken();

    this.verificationResetToken = await bcrypt.hash(verificationToken, 12);
  
    // setting the password reset to expire in 10min
    this.verificationResetExpires = Date.now() + 5 * 60 * 1000;

    return verificationToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;