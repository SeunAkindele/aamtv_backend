const express = require('express');

const countryController = require('./../controllers/countryController');

const router = express.Router();

router.get('/countries', countryController.getCountries);

router.get('/searchcountries', countryController.searchCountry);

router.get('/country/:id', countryController.getCountry);

module.exports = router;