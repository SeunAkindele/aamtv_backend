const mongoose = require('mongoose');

listSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    video: {
        type: mongoose.Schema.ObjectId,
        ref: 'Video'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

listSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'video',
        select: '-__v'
    });

    next();
});

const List = mongoose.model('List', listSchema);

module.exports = List;