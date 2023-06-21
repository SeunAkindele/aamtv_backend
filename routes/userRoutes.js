const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', userController.uploadUserPhoto, userController.resizeUserPhoto, authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);

router.use(authController.protect);

router.post('/pinLogin', authController.pinLogin);
router.post('/subscribe', authController.subscribe);
router.post('/sendverification', authController.sendVerification);
router.post('/verification', authController.verification);
router.patch('/updatePassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.get('/artists', userController.getArtists);

router.route('/')
    .get(userController.getUsers);

router.route('/:id')
    .get(userController.getUser)
    .patch(authController.restrictTo('admin'), userController.updateUser)
    .delete(authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;