const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A video must have a title'],
        unique: true,
        trim: true
    },
    src: {
        type: String,
        required: [true, 'A video must have a source link'],
        unique: true
    },
    photo: {
        type: String,
        required: [true, 'A video must have a thumbnail photo'],
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;