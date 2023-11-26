const User = require('../models/userModel');
const Video = require('../models/videoModel');
const View = require('../models/viewModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setVideoUserIds = (req, res, next) => {
    req.body.user = req.user.id;
    req.body.video = req.params.id;
    next();
}

exports.view =  catchAsync(async (req, res, next) => {
    
    const count = await View.countDocuments({video: req.params.id, user: req.user.id});
    let data = [];

    if(count < 1){
        data = await View.create(req.body);
    }

    res.status(201).json({
        status: 'success',
        data: {
            data
        }
    });

});

exports.getViews = factory.getCountIsExist(View, "video");

exports.updateWatchProgress = catchAsync( async (req, res, next) => {
    const data = await View.findOneAndUpdate({video: req.body.video, user: req.body.user}, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: {
            data
        }
    });
});
 
exports.getWatchProgress = catchAsync( async (req, res, next) => {
    const data = await View.findOne({video: req.body.video, user: req.body.user});

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: {
            data
        }
    });
});

exports.getTrendiest = catchAsync( async (req, res, next) => {
    const category =  req.params.category !== "all" ? {
            $match: {
            'video.category': req.params.category
            }
        } : { $match: {
            'video.category': { $ne: '' }
        }};

    const data = await View.aggregate([
        {
            $group: {
                _id: '$video',
                viewsCount: { $sum: 1 }, // Count the number of times a videoId appears
            },
        },
        {
            $sort: { viewsCount: -1 }, // Sort by viewsCount in descending order
        },
        {
            $limit: 20, // Limit the results to the top 20
        },
        {
            $lookup: {
                from: 'videos', // Name of the Video collection
                localField: '_id',
                foreignField: '_id',
                as: 'video',
            },
        },
        category,
        {
            $unwind: '$video',
        },
    ]);

    const arr = [];
    
    await Promise.all(
        data.map(async (item) => {
            const user = await User.findOne({_id: item.video.user});
            const video = {...item, video: {...item.video, user}};
            arr.push(video);
        })
    );

    res.status(200).json({
        status: 'success',
        results: arr.length,
        data: {
            data: arr
        }
    });
});

exports.getContinueToWatch = catchAsync( async (req, res, next) => {
    const features = new APIFeatures(View.find({status: 'not completed', user: req.body.user}), req.query)
    .lazyLoader()
    .sortByTime();

    const data = await features.query;
    const arr = [];

    await Promise.all(
        data.map(async (item) => {
            const video = await Video.findOne({_id: item.video});
            const progress = item.progress && video.duration ? item.progress / video.duration : 0;
            const result = {video, progress};
            
            arr.push(result);
        })
    );

    res.status(200).json({
        status: 'success',
        results: arr.length,
        data: {
            data: arr
        }
    });
})