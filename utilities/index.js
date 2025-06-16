const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();

  let list = "<ul>";

  list += '<li><a href="/" title="Home page">Home</a></li>';

  data.rows.forEach((row) => {
    list += "<li>";

    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";

    list += "</li>";
  });

  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */

Util.buildClassificationGrid = async function (data) {
  let grid;

  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";

      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";

      grid += "</h2>";

      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";

      grid += "</div>";

      grid += "</li>";
    });

    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ****************************************
 * Build the vehicle detail HTML
 * Assignment 3, Task 1
 **************************************** */Util.buildSingleVehicleDisplay = async (vehicle, showFavorite, accountId) => {
  let v_detail_string = '<div id="vehicle-display">';
  let isFavorite = false;
  if (showFavorite) {
    isFavorite = await invModel.isFavorite(
      accountId,
      vehicle.inv_id);

    v_detail_string += `
    <div class="favorite-toggle">
      <input type="checkbox" id="favorite" name="favorite" ${
        isFavorite ? "checked" : ""
      }>
      <label for="favorite">Favorite</label>
    </div>
    `;
    console.log("isFavorite: ", isFavorite);
  }
  // v_detail_string += `<h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>`;

  v_detail_string += "<div>";
  v_detail_string += '<div class="vehicleImage">';
  v_detail_string +=
    "<img src='" +
    vehicle.inv_image +
    "' alt='Image of " +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    " on cse motors' id='mainImage'>";
  v_detail_string += "</div>";
  v_detail_string += '<div class="vehicleDetail">';
  v_detail_string +=
    "<h2> " + vehicle.inv_make + " " + vehicle.inv_model + " Details</h2>";
  v_detail_string += '<ul id="vehicle-details">';
  v_detail_string +=
    "<li><h3>Price:</h3> $" +
    new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
    "</li>";
  v_detail_string +=
    "<li><h3>Description:</h3> " + vehicle.inv_description + "</li>";
  v_detail_string += "<li><h3>Color:</h3> " + vehicle.inv_color + "</li>";
  v_detail_string +=
    "<li><h3>Miles:</h3> " +
    new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
    "</li>";
  v_detail_string += "</ul>";
  v_detail_string += "</div>";
  v_detail_string += "</div>";
  v_detail_string += "</div>";
  return v_detail_string;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Builds the classification list HTML
 * **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Check JWT Token Middleware
 * Checks if the JWT token is valid
 **************************************** */
Util.CheckJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in to continue.");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedIn = true;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 * Check login Middleware
 * Checks if the user is logged in
 **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedIn) {
    next();
  } else {
    req.flash("notice", "Please log in to continue.");
    res.clearCookie("jwt");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Check Admin and employee authorization Middleware
 * Checks if the user is an admin or employee
 **************************************** */
Util.checkAdmin = (req, res, next) => {
  if (
    (res.locals.accountData &&
      res.locals.accountData.account_type === "Employee") ||
    res.locals.accountData.account_type === "Admin"
  ) {
    next();
  } else {
    req.flash("notice", "You do not have permission to access this page.");
    return res.redirect("/");
  }
};

module.exports = Util;
