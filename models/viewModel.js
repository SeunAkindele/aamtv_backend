const mongoose = require('mongoose');

viewSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    video: {
        type: mongoose.Schema.ObjectId,
        ref: 'Video'
    },
    progress: {
        type: Number,
        default: 0
    },
    roll: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'not completed'
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);


const View = mongoose.model('View', viewSchema);

module.exports = View;