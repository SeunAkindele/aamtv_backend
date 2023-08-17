const mongoose = require('mongoose');

viewSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        unique: true,
    },
    video: {
        type: mongoose.Schema.ObjectId,
        ref: 'Video'
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);


const View = mongoose.model('View', viewSchema);

module.exports = View;