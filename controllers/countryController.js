const Country = require('../models/countryModel');
const factory = require('./handlerFactory');

exports.getCountries = factory.search(Country, "country");

exports.searchCountry = factory.search(Country, "country");