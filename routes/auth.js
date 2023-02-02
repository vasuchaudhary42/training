const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/', authController.registration);

router.post('/registration', authController.registration);

module.exports = router;