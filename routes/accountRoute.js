const express = require('express');
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');
const router = express.Router();

router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));
router.post('/register', utilities.handleErrors(accountController.registerAccount));


module.exports = router;