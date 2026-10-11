// It defines the routes for the user module.

const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

router.get('/me', userController.me);

module.exports = router;
