const Video = require('../models/videoModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const cloudinaryConfig = require('../utils/cloudinary');
const AppError = require('../utils/appError');
const cloudinary = require('cloudinary').v2;

exports.getVideos = catchAsync( async (req, res, next) => {
    const obj = req.params.category !== "all" ? {category: req.params.category} : {category: { $ne: '' }};
    const features = new APIFeatures(Video.find(obj), req.query)
    .lazyLoader()
    .sortByTime();

    const data = await features.query;

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: {
            data
        }
    });
});

exports.getVideosByArtist = factory.getArtistVideos(Video);

exports.getVideo = factory.getOne(Video);

exports.createVideo = catchAsync(async (req, res, next) => {
    cloudinaryConfig.cloudinaryConfig();

    const imageUrl = await cloudinary.uploader.upload(
        `${__dirname}/../assets/images/${req.body.photo}`, 
        { folder: 'aamtv/images' }
    )
    .then((result) => {
        console.log('Image uploaded successfully:', result.url);
        return result.url;
    })
    .catch((error) => {
        console.error('Error uploading image:', error);
        return next(new AppError(`Kindly provide a valid photo cover file`, 400));
    });

    const videoUrl = await cloudinary.uploader.upload(
        `${__dirname}/../assets/videos/${req.body.src}`, 
        {
        resource_type: 'video',
        folder: 'aamtv/videos', // Optional: Specify a folder in your Cloudinary account
        },
        (error, result) => {
        if (error) {
            console.error('Error uploading video:', error);
            return next(new AppError(`Kindly provide a valid video file`, 400));
        } else {
            console.log('Video uploaded successfully:', result.secure_url);
            return result.secure_url;
        }
        }
    );
    
    req.body.src = videoUrl.url;
    req.body.photo = imageUrl;
    
    const data = await Video.create(req.body);
    
    res.status(201).json({
        status: 'success',
        data: {
            data
        }
    });
});


exports.updateVideo = factory.updateOne(Video);

exports.deleteVideo = factory.deleteOne(Video);