// backend/routes/authRoutes.js

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// router.post('/login', authController.verifyFirebaseIdToken);
router.post('/login', authController.handleDirectUserSync);

module.exports = router;
