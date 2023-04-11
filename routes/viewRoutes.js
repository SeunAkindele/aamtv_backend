const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/:id')
    .post( 
        authController.restrictTo('artist', 'user'), 
        viewController.setVideoUserIds, 
        viewController.view
    )
    .get(
        authController.restrictTo('artist', 'user'), 
        viewController.setVideoUserIds, 
        viewController.getViews
    )

module.exports = router;