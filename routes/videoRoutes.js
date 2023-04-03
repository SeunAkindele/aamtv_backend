const express = require('express');

const videoController = require('./../controllers/videoController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/')
    .get(authController.protect, videoController.getVideos)
    .post(videoController.createVideo);

router.route('/:id')
    .get(videoController.getVideo)
    .patch(videoController.updateVideo)
    .delete(videoController.deleteVideo)

module.exports = router;