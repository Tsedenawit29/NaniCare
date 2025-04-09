// backend/routes/nannies.js
const express = require('express');
const router = express.Router();
const nanniesController = require('../controllers/nanniesController');

router.get('/profile', nanniesController.getProfile);
router.post('/profile', nanniesController.updateProfile);
router.post('/availability', nanniesController.updateAvailability);

module.exports = router;