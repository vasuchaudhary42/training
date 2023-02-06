const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const sessionAuthenticator = require('../middlewares/session-authenticator');

router.get('/me', sessionAuthenticator, userController.me);
router.put('/user', sessionAuthenticator, userController.editUserProfile);

module.exports = router;