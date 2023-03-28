const express = require('express');

const videoController = require('./../controllers/videoController');

const router = express.Router();

// router.param('id', (req, res, next, val) => {
//     console.log(`Video id is: ${val}`);
//     next();
// });

router.route('/')
    .get(videoController.getVideos)
    .post(videoController.createVideo);

router.route('/:id')
    .get(videoController.getVideo)
    .patch(videoController.updateVideo)
    .delete(videoController.deleteVideo)

module.exports = router;