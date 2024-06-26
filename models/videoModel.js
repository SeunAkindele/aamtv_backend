const mongoose = require('mongoose');
const slugify = require('slugify');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A video must have a title'],
        unique: true,
        trim: true,
        maxlength: [50, 'A video title must not have more than 50 characters'],
        minlength: [3, 'A video title must have more than 2 characters']
    },
    info: {
        type: String,
        required: [true, 'A video must have some information'],
        maxlength: [200, 'A video info must not have more than 50 characters'],
        minlength: [3, 'A video title must have more than 2 characters']
    },
    slug: String,
    src: {
        type: String,
        required: [true, 'A video must have a source link'],
        unique: true
    },
    photo: {
        type: String,
        required: [true, 'A video must have a thumbnail photo'],
        unique: true
    },
    category: {
        type: String,
        enum: ['music', 'documentary', 'live', 'fashion', 'tourism'],
        default: 'music'
    },
    artist: {
        type: mongoose.Schema.ObjectId,
        ref: 'Follower'
    },
    duration: {
        type: Number,
        default: 0
    },
    roll: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A video must belong to an artist']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    archived: {
        type: Boolean,
        default: false
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

// DOCUMENT MIDDLEWARE: runs before saving into the db
videoSchema.pre('save', function(next) {
    // In this document middleware, we have access to the current document that is being saved.

    this.slug = slugify(this.title, {lower: true});
    next();
});

// // Virtual populate
videoSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'video',
    localField: '_id'
});

// runs immediately after the document is saved
videoSchema.post('save', function(doc, next) {
    this.populate({
        path: 'user',
        select: '-__v -passwordChangedAt -active -disabled -artists -email -role'
    });

    next();
});

videoSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo _id createdAt'
    });

    next();
});


// QUERY MIDDLEWARE: runs before all the queries that start with find
videoSchema.pre(/^find/, function(next) {
    this.find({ archived: { $ne: true } });
    next();
});

videoSchema.post(/^find/, function(docs, next) {
    next();
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;