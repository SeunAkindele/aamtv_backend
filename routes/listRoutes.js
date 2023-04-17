const express = require('express');

const listController = require('../controllers/listController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', authController.restrictTo('artist', 'user'), listController.getMyList);

router.route('/:id')
    .post( 
        authController.restrictTo('artist', 'user'), 
        listController.setVideoUserIds, 
        listController.addList
    )
    .delete(listController.unList);

module.exports = router;