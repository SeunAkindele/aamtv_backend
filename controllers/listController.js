const List = require('../models/listModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setVideoUserIds = (req, res, next) => {
    req.body.user = req.user.id;
    req.body.video = req.params.id;
    next();
}

exports.addList =  catchAsync(async (req, res, next) => {
    
    const count = await List.countDocuments({video: req.params.id, user: req.user.id});
    let data = [];

    if(count < 1){
        data = await List.create(req.body);
    }

    res.status(201).json({
        status: 'success',
        data: {
            data
        }
    });
    
});

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

exports.unList = factory.deleteCustomOne(List, "video");

exports.checkList = factory.getCountIsExist(List, "video");