const Like = require('../models/likeModel');
const factory = require('./handlerFactory');

exports.setVideoUserIds = (req, res, next) => {
    req.body.user = req.user.id;
    req.body.video = req.params.id;
    next();
}

exports.like = factory.createOne(Like);

exports.unlike = factory.deleteOne(Like);