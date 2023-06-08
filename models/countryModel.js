const mongoose = require('mongoose');

countrySchema = new mongoose.Schema({
    country: {
        type: String,
        required: [true, 'Country can not be empty!']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    flag: {
        type: String,
        required: [true, 'Flag can not be empty!']
    },
    code: {
        type: String,
        required: [true, 'Code can not be empty!']
    },
    active: {
        type: Boolean,
        default: true
    }
},
);


const Country = mongoose.model('Country', countrySchema);

module.exports = Country;