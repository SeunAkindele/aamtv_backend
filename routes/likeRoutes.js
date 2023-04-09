const express = require('express');

const likeController = require('../controllers/likeController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/:id')
    .post( 
        authController.restrictTo('artist', 'user'), 
        likeController.setVideoUserIds, 
        likeController.like
    )
    .delete(likeController.unlike);

module.exports = router;