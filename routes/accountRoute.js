const express = require("express");
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const router = express.Router();
const validate = require("../utilities/account-validation");

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/logout", utilities.handleErrors(accountController.logoutAccount));

router.get(
  "/account-update",
  utilities.checkLogin,
  utilities.CheckJWTToken,
  utilities.handleErrors(accountController.buildAccountUpdate)
)
router.post(
  "/account-update",
  utilities.checkLogin,
  // validate.checkAccountUpdate,
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/change-password",
  utilities.checkLogin,
  utilities.handleErrors(
    accountController.changePassword)
)

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
// Process the registration data
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.loginAccount)
);

module.exports = router;
