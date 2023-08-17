const Video = require('../models/videoModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getVideos = factory.getAll(Video);

exports.getVideosByArtist = factory.getArtistVideos(Video);

exports.getVideo = factory.getOne(Video);

exports.createVideo = factory.createOne(Video);

exports.updateVideo = factory.updateOne(Video);

exports.deleteVideo = factory.deleteOne(Video);