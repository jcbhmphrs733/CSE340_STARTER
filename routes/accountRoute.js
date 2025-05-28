const express = require('express');
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');
const router = express.Router();

router.get('/login', utilities.handleErrors(accountController.buildLogin));

module.exports = router;