const Search = require('../models/searchModel');
const User = require('../models/userModel');
const Video = require('../models/videoModel');
const Follower = require('../models/followerModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.searchScreen = factory.searchMany(User, Video, "name", "title");

exports.recentSearch = catchAsync( async (req, res, next) => {
    const features = new APIFeatures(Search.find({user: req.user.id}), req.query)
    .limit()
    .sortByTime();

    const data = await features.query;
    const arr=[];

    await Promise.all(
        data.map(async (result) => {
            if(result.category === 'artist'){
                const videos = await Video.countDocuments({user: result.artist._id});
                const followers = await Follower.countDocuments({artist: result.artist._id});
                const user = await User.findOne({_id: result.artist._id});
                
                arr.push({ artist: user, videos, followers, category: result.category });
            } else {
                const video = await Video.findOne({_id: result.video._id});
                arr.push({video, category: result.category});
            }
        })
    );

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: {
            data: arr
        }
    });
});