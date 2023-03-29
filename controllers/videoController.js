const Video = require('./../models/videoModel');

exports.getVideos = async (req, res) => {
    try{
        
        const skip = parseInt(req.query.skip);

        let query = Video.find();

        // skip & limit for lazy loader
        query = query.skip(skip).limit(50);

        // sort by time in descending order
        query = query.sort({createdAt: -1});

        const videos = await query;

        res.status(200).json({
            status: 'success',
            results: videos.length,
            data: {
                videos
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                video
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.createVideo = async (req, res) => {
    try {
        const newVideo = await Video.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                video: newVideo
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.updateVideo = async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(201).json({
            status: 'success',
            data: {
                video
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}