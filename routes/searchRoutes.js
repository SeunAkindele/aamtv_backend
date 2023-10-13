const express = require('express');

const searchController = require('./../controllers/searchController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/searchScreen', searchController.searchScreen);
router.get('/recentSearch', searchController.recentSearch);

module.exports = router;