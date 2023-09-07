const express = require('express');

const countryController = require('./../controllers/countryController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/countries', countryController.getCountries);

router.get('/searchcountries', countryController.searchCountry);

router.use(authController.protect);

router.get('/country/:id', countryController.getCountry);

module.exports = router;