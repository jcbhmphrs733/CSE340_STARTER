const e = require("connect-flash");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

/* ***************************
 *  Build inventory by classification view
 * ************************** */
async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
}

/* ***************************
 *  Build vehicle detail view
 *  Assignment 3, Task 1
 * ************************** */
async function buildDetail(req, res, next) {
  const invId = req.params.id;
  let vehicle = await invModel.getInventoryById(invId);
  const htmlData = await utilities.buildSingleVehicleDisplay(vehicle);
  let nav = await utilities.getNav();
  const vehicleTitle =
    vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model;
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    message: null,
    htmlData,
  });
}

/* ****************************************
 * Build inventory management view
 **************************************** */
async function buildInventoryManagement(req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    // messages: req.flash("notice"),
    errors: null,
  });
}

/* ****************************************
 * Build inventory management view
 **************************************** */
async function buildNewClassification(req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/newClassification", {
    title: "Add New Classification",
    nav,
    // messages: req.flash("notice"),
    errors: null,
  });
}

/* ****************************************
 * Build inventory management view
 **************************************** */
async function buildNewVehicle(req, res) {
  let nav = await utilities.getNav();
  let arrayClassifications = await utilities.buildClassificationList();
  res.render("inventory/newVehicle", {
    title: "Add New Vehicle",
    classifications: arrayClassifications,
    nav,
    // messages: req.flash("notice"),
    errors: null,
  });
}

/* ****************************************
 * Add new classification to the database
 **************************************** */

async function addNewClassification(req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const alphaRegex = /^[A-Za-z\s]+$/;
  if (alphaRegex.test(classification_name)) {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("notice", "New classification added successfully.");
      res.status(201).redirect("/");
    } else {
      req.flash("notice", "Failed to add new classification.");
      res.status(500).render("inventory/newClassification", {
        title: "Add New Classification",
        nav,
        errors: null,
      });
    }
  } else {
    req.flash("notice", "Classification name must contain only letters.");
    res.status(400);
    res.render("inventory/newClassification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 * Add new vehicle to the database
 **************************************** */
async function addNewVehicle(req, res) {
  let nav = await utilities.getNav();
  let arrayClassifications = await utilities.buildClassificationList();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  // Validation
  let errors = [];
  if (!inv_make || inv_make.length < 3) {
    errors.push("Make must be at least 3 characters.");
  }
  if (!inv_model || inv_model.length < 3) {
    errors.push("Model must be at least 3 characters.");
  }
  if (!/^\d{4}$/.test(inv_year)) {
    errors.push("Year must be a 4-digit number.");
  }
  if (!/^\d+$/.test(inv_miles)) {
    errors.push("Miles must be an integer.");
  }
  if (!/^\d+(\.\d{1,2})?$/.test(inv_price)) {
    errors.push("Price must be a valid integer or decimal.");
  }

  if (errors.length > 0) {
    req.flash("notice", errors.join(" "));
    return res.status(400).render("inventory/newVehicle", {
      title: "Add New Vehicle",
      classifications: arrayClassifications,
      nav,
      errors,
      // repopulate fields for user convenience
      locals: req.body,
    });
  }

  const result = await invModel.addVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
  if (result) {
    req.flash("notice", "New vehicle added successfully.");
    res.status(201).redirect("/");
  } else {
    req.flash("notice", "Failed to add new vehicle.");
    res.status(500).render("inventory/newVehicle", {
      title: "Add New Vehicle",
      classifications: arrayClassifications,
      nav,
      errors: ["Failed to add new vehicle."],
      locals: req.body,
    });
  }
}

module.exports = {
  buildByClassificationId,
  buildDetail,
  buildInventoryManagement,
  buildNewClassification,
  buildNewVehicle,
  addNewClassification,
  addNewVehicle,
};
