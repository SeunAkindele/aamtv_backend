const express = require('express');

const videoController = require('./../controllers/videoController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/')
    .post(
        authController.protect, 
        authController.restrictTo('admin'), 
        videoController.createVideo
    );

router.route('/:category')
    .get(
        authController.protect, 
        videoController.getVideos
    )

router.route('/video/:id')
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

router.get('/getArtistVideos/:id', authController.protect, videoController.getVideosByArtist);

module.exports = router;