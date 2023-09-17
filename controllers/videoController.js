const Video = require('../models/videoModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

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

exports.createVideo = factory.createOne(Video);

exports.updateVideo = factory.updateOne(Video);

exports.deleteVideo = factory.deleteOne(Video);