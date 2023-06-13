const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = id => {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

const createSendToken = async (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.sendVerification = catchAsync(async (req, res, next) => {
    const verificationToken = await req.user.createVerificationResetToken();
    await req.user.save({ validateBeforeSave: false });
    const message = `Your verification token ${verificationToken}`;

    try{
        const url = `${req.protocol}://${req.get('host')}/sendverification`;

        await new Email(req.user, url).sendVerificationCode(message);

        res.status(200).json({
            status: 'success',
            message: 'A verification code has been sent to your email!'
        });
    } catch(err) {
        req.user.createVerificationResetToken = undefined;
        req.user.verificationResetToken = undefined;

        await req.user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Please try again later!', 500));
    }
});

exports.signup = catchAsync(async (req, res, next) => {
    if(req.file) req.body.photo = req.file.filename;
    
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        country: req.body.country,
        phone: req.body.phone,
        role: req.body.role,
        skill: req.body.skill,
        photo: req.body.photo,
        introduction: req.body.introduction,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm        
    });

    const url = `${req.protocol}://${req.get('host')}/signup`;

    await new Email(newUser, url).sendWelcome();
    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password exist
    if(!email || !password) {
        return next(new AppError('Please provide email and password!', 400))
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    if(await user.checkActive()) {
        return next(new AppError('Your account is not active, please contact the administrator!', 401));
    }
    
    // Send token to client
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    // Get token to check if it exist
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new AppError('You are not logged in! Please log in to get access.'))
    }

    // Verify the token authenticity and expiration date
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    // Check if user trying to access route still exist
    const currentUser = await User.findById(decoded.id);

    if(!currentUser) {
        return next(new AppError('The user that owns this token no longer exist', 401));
    }

    // Check if user changed password after the token was issued

    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please login again.', 401));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        
        // req.user.role is accessed from line 87 after successful login
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    }
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // Get user based on posted email
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next(new AppError('There is no user with this email!', 404));
    }

    // Generate the random reset token
    const resetToken = await user.createPasswordResetToken();

    // modifying the user document with the added passwordResetToken and passwordResetExpires property using save in-built function
    await user.save({ validateBeforeSave: false });

    // Send it to user's email
    // const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`; for web version

    const message = `Copy the token below and paste in the provided field in the app to change your password.\n${resetToken}\nIf you didn't forget your password, please ignore this email!`;

    try {
        const url = `${req.protocol}://${req.get('host')}/forgotPassword`;

        await new Email(user, url).sendVerificationCode(message);

        res.status(200).json({
            status: 'success',
            message: 'A code has been sent to your email!'
        });
    } catch(err) {
        user.createPasswordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Please try again later!', 500));
    }
});

exports.resetPassword = async (req, res, next) => {
    // Get user based on the token

    const user = await User.findOne({email: req.body.email, passwordResetExpires: { $gt: Date.now() }}).select('+passwordResetToken');

    // if token has not expired and there is user, set new password
    if(!user || !await user.correctOTP(req.body.token, user.passwordResetToken)) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    // update changePasswordAt property for the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    try{
        // validation is not turned off so it validates if the passwords.
        await user.save();

        // log the user in, send jwt
        createSendToken(user, 200, res);
    }catch(err){
        return next(err);
    }
};

exports.updatePassword = catchAsync(async (req, res, next) => {
    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // Check if the current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Invalid current password', 401));
    }

    // If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Log user in, send jwt
    createSendToken(user, 200, res);
});