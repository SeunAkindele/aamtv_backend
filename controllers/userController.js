const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');
const Follower = require('../models/followerModel');

exports.getUsers = factory.getAll(User, 
    {
        role: {$ne: 'admin'},
        active: {$ne: false}, 
        disabled: {$ne: true}
    }
);

exports.getUser = factory.getOne(User);

exports.getArtists = catchAsync( async (req, res, next) => {
    const features = new APIFeatures(User.find({role: 'artist'}), req.query)
    .lazyLoader()
    .sortByTime();

    const data = await features.query.populate('followers');

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: {
            data
        }
    });
});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

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

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);