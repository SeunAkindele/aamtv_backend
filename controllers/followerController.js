const Follower = require('../models/followerModel');
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
    const features = new APIFeatures(Follower.find({artist: req.user.id}), req.query)
    .lazyLoader()
    .sortByTime();

    const data = await features.query;

    const arr = [];

    await Promise.all(
        data.map(async (follower) => {
          const isFollowedBack = await Follower.exists({ artist: follower.user._id, user: req.user.id });
          arr.push({ follower: follower.user, isFollowedBack });
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
    const features = new APIFeatures(Follower.find({user: req.user.id}), req.query)
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

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: {
            data
        }
    });
});

exports.getFollowing = factory.getCountIsExist(Follower);

exports.getFollowers = factory.getCountIsExist(Follower, "artist");

exports.unFollow = factory.deleteOne(Follower);