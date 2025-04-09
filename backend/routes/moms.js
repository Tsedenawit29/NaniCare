// backend/routes/moms.js
const express = require('express');
const router = express.Router();
const momsController = require('../controllers/momsController');

router.get('/nannies', momsController.searchNannies);

module.exports = router;