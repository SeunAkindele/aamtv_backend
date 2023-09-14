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

// exports.view = factory.createOne(View);

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

exports.getTrendiest = catchAsync( async (req, res, next) => {
   
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