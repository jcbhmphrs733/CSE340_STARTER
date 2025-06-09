const utilities = require("../utilities");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  // req.flash("notice", "Welcome to the Home Page!")
  res.render("index", {
    title: "Home",
    nav,
    loggedIn: res.locals.loggedIn,
    account_firstname: res.locals.accountData
      ? res.locals.accountData.account_firstname
      : " Guest",
  });
};

baseController.throwError = async function (req, res) {
  const err = new Error("Uh oh, something went wrong!");
  err.status = 500;
  throw err;
};

module.exports = baseController;
