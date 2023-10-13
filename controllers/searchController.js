const Search = require('../models/searchModel');
const User = require('../models/userModel');
const Video = require('../models/videoModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.searchScreen = factory.searchMany(User, Video, "name", "title");

exports.recentSearch = catchAsync( async (req, res, next) => {
    const features = new APIFeatures(Search.find({user: req.user.id}), req.query)
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