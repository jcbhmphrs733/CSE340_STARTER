// const invModel = require("../models/inventory-model")
const utilities = require("../utilities/");

async function buildLogin(req, res) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    // messages: req.flash("notice"),
  });
}

module.exports = {
  buildLogin,
};
