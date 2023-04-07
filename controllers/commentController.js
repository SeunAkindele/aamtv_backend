const Comment = require('../models/commentModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getComments = factory.getAll(Comment);

exports.setVideoUserIds = (req, res, next) => {
    req.body.user = req.user.id;
    req.body.video = req.params.id;
    next();
}

exports.createComment = factory.createOne(Comment);

exports.updateComment = factory.updateOne(Comment);

exports.deleteComment = factory.deleteOne(Comment);