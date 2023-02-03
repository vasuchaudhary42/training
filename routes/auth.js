const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/registration', authController.registration);
router.post('/login', authController.login);

module.exports = router;