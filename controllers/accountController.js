// const invModel = require("../models/inventory-model")
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

async function buildLogin(req, res) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    // messages: req.flash("notice"),
    errors: null,
  });
}

async function buildRegister(req, res) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    // messages: req.flash("notice"),
    errors: null,
  });
}

async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash("notice", "Registration successful. You can now log in.");
    res.status(201).redirect("/account/login");
  } else {
    req.flash("notice", "Registration failed. Please try again.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

async function loginAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  // Here you would typically check the credentials against the database
  // For now, we will just simulate a successful login
  if (account_email && account_password) {
    req.flash("notice", `Login successful. Welcome back ${account_email}!`);
    res.status(200).redirect("/");
  } else {
    req.flash("notice", "Login failed. Please check your credentials.");
    res.status(401).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}



module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
};
