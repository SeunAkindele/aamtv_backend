const List = require('../models/listModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setVideoUserIds = (req, res, next) => {
    req.body.user = req.user.id;
    req.body.video = req.params.id;
    next();
}

exports.addList = factory.createOne(List);

exports.getMyList = catchAsync( async (req, res, next) => {
    const features = new APIFeatures(List.find({user: req.user.id}), req.query)
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

exports.unList = factory.deleteOne(List);

exports.checkList = factory.getCountIsExist(List, "video");