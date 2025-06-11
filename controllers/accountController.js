// const invModel = require("../models/inventory-model")
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function buildLogin(req, res) {
  let nav = await utilities.getNav();
  if (res.locals.loggedIn) {
    return res.redirect("/account/");
  } else {
    res.render("account/login", {
      title: "Login",
      nav,
      // messages: req.flash("notice"),
      errors: null,
      loggedIn: res.locals.loggedIn,
      account_firstname: res.locals.accountData
        ? res.locals.accountData.account_firstname
        : " Guest",
    });
  }
}

async function buildRegister(req, res) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    // messages: req.flash("notice"),
    errors: null,
    loggedIn: res.locals.loggedIn,
    account_firstname: res.locals.accountData
      ? res.locals.accountData.account_firstname
      : " Guest",
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
  const hashedPassword = await bcrypt.hash(account_password, 10);
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
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
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Login failed. Please check your credentials.");
    res.status(401).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      // Password matches, create JWT token
      delete accountData.account_password; // Remove password from accountData
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 }); // Set JWT in cookie
      req.flash("notice", `Login successful. Welcome back ${account_email}!`);
      return res.status(200).redirect("/account/");
    } else {
      req.flash("notice", "Login failed. Please check your credentials.");
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email: account_email,
      });
    }
  } catch (error) {
    return new Error("access denied");
  }
}

async function logoutAccount(req, res) {
  res.clearCookie("jwt"); // Clear the JWT cookie
  req.flash("notice", "You have been logged out successfully.");
  return res.redirect("/");
}

async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav();
  if (!res.locals.loggedIn) {
    req.flash("notice", "Please log in to access your account.");
    return res.redirect("/account/login");
  }
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData,
    errors: null,
    account_email: res.locals.accountData.account_email,
    loggedIn: res.locals.loggedIn,
    account_firstname: res.locals.accountData.account_firstname,
  });
}

async function buildAccountUpdate(req, res) {
  let nav = await utilities.getNav();
  if (!res.locals.loggedIn) {
    req.flash("notice", "Please log in to update your account.");
    return res.redirect("/account/login");
  }
  const accountData = await accountModel.getAccountById(
    res.locals.accountData.account_id
  );
  res.locals.accountData = accountData; // Update the account data in locals
  res.render("account/account-update", {
    title: "Update Account",
    nav,
    accountData: accountData,
    errors: null,
    loggedIn: res.locals.loggedIn,
    // account_firstname: res.locals.accountData.account_firstname,
  });
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  if (!res.locals.loggedIn) {
    req.flash("notice", "Please log in to update your account.");
    return res.redirect("account/login");
  }
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  const updatedAccount = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (updatedAccount) {
    req.flash("notice", "Account updated successfully.");
    res.locals.accountData = updatedAccount.rows[0]; // Update the account data in locals
    return res.render("account/account-management", {
      title: "Account Management",
      nav,
      accountData: updatedAccount.rows[0],
      errors: null,
      account_email: updatedAccount.rows[0].account_email,
      loggedIn: res.locals.loggedIn,
      account_firstname: updatedAccount.rows[0].account_firstname,
    });
  } else {
    req.flash("notice", "Failed to update account. Please try again.");
    return res.status(500).render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
      loggedIn: res.locals.loggedIn,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  buildAccountManagement,
  logoutAccount,
  buildAccountUpdate,
  updateAccount,
};
