const express = require('express');

const followerController = require('../controllers/followerController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/myFollowers', authController.restrictTo('artist'), followerController.getMyFollowers);
router.get('/artistFollowers/:id', authController.restrictTo('user'), followerController.getArtistFollowers);
router.get('/myArtists', authController.restrictTo('artist', 'user'), followerController.getMyArtists);

router.route('/:id')
    .post( 
        authController.restrictTo('artist', 'user'), 
        followerController.setArtistUserIds, 
        followerController.follow
    )
    .get(
        authController.restrictTo('artist', 'user'), 
        followerController.setArtistUserIds, 
        followerController.checkFollowing
    )
    .delete(followerController.unFollow);

module.exports = router;