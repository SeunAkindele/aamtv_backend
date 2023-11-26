const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/trendiest/:category', authController.restrictTo('artist', 'user'), viewController.getTrendiest);

router.route('/continueToWatch')
    .get(
        authController.protect, 
        viewController.setVideoUserIds,
        viewController.getContinueToWatch
    )

router.get('/progress/:id',
    authController.restrictTo('artist', 'user'), 
    viewController.setVideoUserIds,
    viewController.getWatchProgress
)

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
    ).patch( 
        authController.restrictTo('artist', 'user'), 
        viewController.setVideoUserIds, 
        viewController.updateWatchProgress
    )

module.exports = router;