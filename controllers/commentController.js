const Comment = require('../models/commentModel');
const factory = require('./handlerFactory');

exports.getComments = factory.getAll(Comment);

exports.setVideoUserIds = (req, res, next) => {
    req.body.user = req.user.id;
    req.body.video = req.params.id;
    next();
};

exports.createComment = factory.createOne(Comment);

exports.updateComment = factory.updateOne(Comment);

exports.deleteComment = factory.deleteCustomOne(Comment, "video");

exports.getCommentCounts = factory.getCountIsExist(Comment, "video");