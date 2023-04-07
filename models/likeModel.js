const mongoose = require('mongoose');

likeSchema = new mongoose.Schema({
    like: {
        type: Number,
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
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;