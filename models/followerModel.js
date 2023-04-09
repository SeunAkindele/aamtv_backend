const mongoose = require('mongoose');

followerSchema = new mongoose.Schema({
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

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;