const mongoose = require('mongoose');

likeSchema = new mongoose.Schema({
    like: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    video: {
        type: mongoose.Schema.ObjectId,
        ref: 'Video',
        required: [true, 'Like must belong to a video']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Like must belong to a user']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;