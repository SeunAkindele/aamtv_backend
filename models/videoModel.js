const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A video must have a title'],
        unique: true,
        trim: true,
        maxlength: [50, 'A video title must not have more than 50 characters'],
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
    createdAt: {
        type: Date,
        default: Date.now()
    },
    archived: {
        type: Boolean,
        default: false
    }
});

// DOCUMENT MIDDLEWARE: runs before saving into the db
videoSchema.pre('save', function(next) {
    // In this document middleware, we have access to the current document that is being saved.

    this.slug = slugify(this.title, {lower: true});
    next();
});

// runs immediately after the document is saved
videoSchema.post('save', function(doc, next) {
    
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

// Pluss123@