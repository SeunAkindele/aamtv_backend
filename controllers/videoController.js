const Video = require('../models/videoModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getVideos = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Video.find(), req.query)
    .lazyLoader()
    .sortByTime();

    const videos = await features.query;

    res.status(200).json({
        status: 'success',
        results: videos.length,
        data: {
            videos
        }
    });
});

exports.getVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.id);

    if(!video) {
        return next(new AppError('Video not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            video
        }
    });
});

exports.createVideo = catchAsync(async (req, res, next) => {
    
    const newVideo = await Video.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            video: newVideo
        }
    });
   
});

exports.updateVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!video) {
        return next(new AppError('Video not found', 404));
    }

    res.status(201).json({
        status: 'success',
        data: {
            video
        }
    });
});

exports.deleteVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findByIdAndDelete(req.params.id);

    if(!video) {
        return next(new AppError('Video not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});