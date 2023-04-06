const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getUsers = catchAsync( async (req, res, next) => {
    const users = await User.find(
        {
            role: {$ne: 'admin'},
            active: {$ne: false}, 
            disabled: {$ne: true}
        }
    );

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route does not exist'
    });
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
};


exports.updateMe = async (req, res, next) => {
    // Create error if user tries to update password
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password update', 400));
    }

    // User can update only name, email and profile picture
    const filteredBody = filterObj(req.body, 'name', 'email');

    const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
};

exports.deleteMe = catchAsync(async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null
    });
});