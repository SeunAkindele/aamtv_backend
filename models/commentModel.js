const mongoose = require('mongoose');

commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Comment can not be empty!']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    video: {
        type: mongoose.Schema.ObjectId,
        ref: 'Video',
        required: [true, 'Comment must belong to a video']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Comment must belong to a user']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

commentSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: '-__v -passwordChangedAt -active -disabled -artists -email -role'
    });

    next();
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;