const Country = require('../models/countryModel');
const factory = require('./handlerFactory');

exports.getCountries = factory.getAllAsc(Country);