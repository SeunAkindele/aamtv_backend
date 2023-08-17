const express = require('express');

const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/:id')
    .post( 
        authController.restrictTo('artist', 'user'), 
        commentController.setVideoUserIds, 
        commentController.createComment
    )
    .get(commentController.getComments)
    .patch(authController.restrictTo('artist', 'user'), commentController.updateComment)
    .delete(commentController.deleteComment);

router.get('/count/:id', commentController.getCommentCounts);

module.exports = router;