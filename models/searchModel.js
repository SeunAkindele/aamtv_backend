const mongoose = require('mongoose');

searchSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.ObjectId,
        ref: 'Video'
    },
    artist: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    active: {
        type: Boolean,
        default: true
    }
},
);

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;