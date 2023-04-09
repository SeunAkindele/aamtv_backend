const View = require('../models/viewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setVideoUserIds = (req, res, next) => {
    req.body.user = req.user.id;
    req.body.video = req.params.id;
    next();
}

exports.view = factory.createOne(View);

exports.getViews = factory.getCountIsExist(View, "video");