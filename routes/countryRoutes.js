const express = require('express');

const countryController = require('./../controllers/countryController');

const router = express.Router();

router.get('/countries', countryController.getCountries);

module.exports = router;