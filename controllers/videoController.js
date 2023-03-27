const fs = require('fs');

const videos = JSON.parse(fs.readFileSync(`${__dirname}/../dev_video_data.json`));

exports.getVideos =  (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: videos.length,
        data: {
            videos
        }
    });
};

exports.getVideo =  (req, res) => {
    const video = videos.find(el => el.id === req.params.id);

    if(!video) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            video
        }
    });
};