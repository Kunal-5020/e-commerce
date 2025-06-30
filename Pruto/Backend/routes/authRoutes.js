// backend/routes/authRoutes.js

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/verify-id-token', authController.verifyFirebaseIdToken);

module.exports = router;
