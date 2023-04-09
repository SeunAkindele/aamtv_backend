const mongoose = require('mongoose');

viewSchema = new mongoose.Schema({
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

const View = mongoose.model('View', viewSchema);

module.exports = View;