const mongoose = require('mongoose');

followerSchema = new mongoose.Schema(
    {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        artist: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

followerSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: '-__v -passwordChangedAt -active -disabled -artists -email -role'
    });

    next();
});

followerSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'artist',
        select: '-__v -passwordChangedAt -active -disabled -artists -email -role'
    });

    next();
});

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;