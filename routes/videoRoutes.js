const express = require('express');

const videoController = require('./../controllers/videoController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/')
    .get(
        authController.protect, 
        videoController.getVideos
    )
    .post(
        authController.protect, 
        authController.restrictTo('admin'), 
        videoController.createVideo
    );

router.route('/:id')
    .get(
        authController.protect, 
        videoController.getVideo
    )
    .patch(
        authController.protect, 
        authController.restrictTo('admin'), 
        videoController.updateVideo
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'), 
        videoController.deleteVideo
    );

module.exports = router;