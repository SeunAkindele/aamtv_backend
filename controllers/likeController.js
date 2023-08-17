const Like = require('../models/likeModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setVideoUserIds = (req, res, next) => {
    req.body.user = req.user.id;
    req.body.video = req.params.id;
    next();
}

exports.like = factory.createOne(Like);

exports.getLikes = factory.getCountIsExist(Like, "video");

exports.unlike = factory.deleteCustomOne(Like, "video");