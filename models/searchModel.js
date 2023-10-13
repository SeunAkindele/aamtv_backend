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
    category: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
},
);

searchSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'video',
        select: '-__v'
    });

    next();
});

searchSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'artist',
        select: '-__v'
    });

    next();
});

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;