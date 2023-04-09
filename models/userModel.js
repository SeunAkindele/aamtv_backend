const crypto = require('crypto');
const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 8,
        select: false
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
    disabled: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'artist', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    },
    passwordResetToken: String,
    passwordResetExpires: Date
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

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
    localField: '_id'
});

userSchema.virtual('followings', {
    ref: 'Follower',
    foreignField: 'user',
    localField: '_id'
});

// current user document being queried has access to this function
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkActive = function() {
    if(!this.active || this.disabled) {
        return true;
    } 

    return false;
};

// checking if password has been changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    // setting the password reset to expire in 10min
    this.passwordResetExpires = Date.now() + 5 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;