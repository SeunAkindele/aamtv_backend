const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'assets/profile-images');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.body.email}-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
    if(!req.file) return next();

    for(const key in req.body){
        if(!req.body[key]) {
            return next(new AppError(`Kindly provide your ${key}`, 400));
        }
    }

    req.file.filename = `user-${req.body.email}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`assets/profile-images/${req.file.filename}`);

    next();
}

exports.getUsers = factory.getAll(User, 
    {
        role: {$ne: 'admin'},
        active: {$ne: false}, 
        disabled: {$ne: true}
    }
);

exports.getUser = factory.getOne(User);

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

    if(req.file) req.body.photo = req.file.filename;

    // User can update only name, email and profile picture
    const filteredBody = filterObj(req.body, 'name', 'skill', 'phone', 'role', 'photo', 'introduction');

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

exports.getArtists = catchAsync( async (req, res, next) => {
    const obj = req.query.country != "" ? {role: 'artist', country: req.query.country} : {role: 'artist'};
    const features = new APIFeatures(User.find(obj), req.query)
    .lazyLoader()
    .sortByTime();

    const data = await features.query.populate('followers videos');

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: {
            data
        }
    });
});