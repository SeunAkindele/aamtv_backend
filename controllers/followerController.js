const Follower = require('../models/followerModel');
const User = require('../models/userModel');
const Video = require('../models/videoModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setArtistUserIds = (req, res, next) => {
    req.body.user = req.user.id;
    req.body.artist = req.params.id;
    next();
}

exports.follow = factory.createOne(Follower);

exports.getMyFollowers = catchAsync( async (req, res, next) => {
    const id = new APIFeatures(User.find({name: { $regex: new RegExp(req.query.search, 'i') }}), req.query)
    .lazyLoader();
    const userId = await id.query;
    // console.log(req.query.search, userId);
    const features = req.query.search !== "" && userId.length > 0 ? new APIFeatures(Follower.find({user: userId[0]._id, artist: req.user.id}), req.query)
    .lazyLoader()
    .sortByTime():
    new APIFeatures(Follower.find({artist: req.user.id}), req.query)
    .lazyLoader()
    .sortByTime();

    const data = await features.query;

    const arr = [];

    await Promise.all(
        data.map(async (follower) => {
          const isFollowedBack = await Follower.exists({ artist: follower.user._id, user: req.user.id });
          const videos = await Video.countDocuments({user: follower.user._id});
          const followers = await Follower.countDocuments({artist: follower.user._id});
          arr.push({ follower: follower.user, isFollowedBack, videos, followers });
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

exports.getMyFollowing = catchAsync( async (req, res, next) => {
    const id = new APIFeatures(User.find({name: { $regex: new RegExp(req.query.search, 'i') }, role: 'artist'}), req.query)
    .lazyLoader();
    const userId = await id.query;
    
    const features = req.query.search !== "" && userId.length > 0 ? new APIFeatures(Follower.find({artist: userId[0]._id, user: req.user.id}), req.query)
    .lazyLoader()
    .sortByTime():
    new APIFeatures(Follower.find({user: req.user.id}), req.query)
    .lazyLoader()
    .sortByTime();

    const data = await features.query;

    const arr = [];

    await Promise.all(
        data.map(async (following) => {
          const videos = await Video.countDocuments({user: following.artist._id});
          const followers = await Follower.countDocuments({artist: following.artist._id});
          arr.push({ user: following.user, artist: following.artist, videos, followers });
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

exports.getFollowingVideos = catchAsync( async (req, res, next) => {
    const features = new APIFeatures(Follower.find({user: req.user.id}), req.query)
    .lazyLoader()
    .sortByTime();

    const data = await features.query;

    const arr = [];

    await Promise.all(
        data.map(async (following) => {
            const videos = await Video.find({user: following.artist._id});
            if(videos.length > 0){
                arr.push({ videos });
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

exports.getArtistFollowers = catchAsync( async (req, res, next) => {
    const features = new APIFeatures(Follower.find({artist: req.params.id}), req.query)
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

exports.checkFollowing = catchAsync( async (req, res, next) => {
    const features = new APIFeatures(Follower.find({artist: req.params.id, user: req.user.id}), req.query)
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

exports.getMyArtists = catchAsync( async (req, res, next) => {
    const features = new APIFeatures(Follower.find({user: req.user.id}), req.query)
    .lazyLoader()
    .sortByTime();

    const data = await features.query;

    const arr = [];

    await Promise.all(
        data.map(async (following) => {
          const videos = await Video.countDocuments({user: following.artist._id});
          const followers = await Follower.countDocuments({artist: following.artist._id});
          arr.push({ user: following.user, artist: following.artist, videos, followers });
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

exports.getFollowing = factory.getCountIsExist(Follower);

exports.getFollowers = factory.getCountIsExist(Follower, "artist");

exports.unFollow = factory.deleteOne(Follower);