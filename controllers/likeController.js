const Like = require('../models/likeModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setVideoUserIds = (req, res, next) => {
    req.body.user = req.user.id;
    req.body.video = req.params.id;
    next();
}


exports.like =  catchAsync(async (req, res, next) => {
    
    const count = await Like.countDocuments({video: req.params.id, user: req.user.id});
    let data = [];

    if(count < 1){
        data = await Like.create(req.body);
    }

    res.status(201).json({
        status: 'success',
        data: {
            data
        }
    });
    
});

exports.getLikes = factory.getCountIsExist(Like, "video");

exports.unlike = factory.deleteCustomOne(Like, "video");