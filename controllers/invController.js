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
  let classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    // messages: req.flash("notice"),
    errors: null,
    classifications: classificationSelect,
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
 * Build vehicle edit view
 **************************************** */
async function buildEditVehicle(req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classifications = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications: classifications,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
}

/* ****************************************
 * Build vehicle delete view
 **************************************** */
async function buildDeleteVehicle(req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    classification_name: itemData.classification_name,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
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

/* ****************************************
 * Delete vehicle from the database
 **************************************** */

async function deleteVehicle(req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const deleteResult = await invModel.deleteVehicle(inv_id);
  if (deleteResult) {
    req.flash(
      "notice",
      `${itemData.rows[0].inv_make} ${itemData.rows[0].inv_model} deleted successfully.`
    );
    res.status(200).redirect("/inv/");
  } else {
    req.flash("notice", "Failed to delete vehicle.");
    res.status(500).render("inventory/delete-inventory", {
      title: "Delete " + itemData.inv_make + " " + itemData.inv_model,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    });
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
async function getInventoryJSON(req, res, next) {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
}

/* ****************************************
 * Update vehicle details
 **************************************** */

async function updateVehicle(req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
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
  if (!inv_color) {
    errors.push("Color is required.");
  }

  if (errors.length > 0) {
    req.flash("notice", errors.join(" "));
    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      classifications: await utilities.buildClassificationList(),
      errors: null,
      inv_id: inv_id,
      inv_make: inv_make,
      inv_model: inv_model,
      inv_year: inv_year,
      inv_description: inv_description,
      inv_image: inv_image,
      inv_thumbnail: inv_thumbnail,
      inv_price: inv_price,
      inv_miles: inv_miles,
      inv_color: inv_color,
      classification_id: classification_id,
    });
  }

  const updateResult = await invModel.updateInventory(
    inv_id,
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
  if (updateResult) {
    const itemName =
      updateResult.rows[0].inv_make + " " + updateResult.rows[0].inv_model;
    req.flash("notice", `${itemName} updated successfully.`);
    res.status(200).redirect("/inv/");
  } else {
    req.flash("notice", "Failed to update vehicle.");
    res.status(500).render("inventory/edit-inventory", {
      title: "Edit Vehicle",
      nav,
      classifications: await utilities.buildClassificationList(),
      errors: null,
      inv_id,
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
  getInventoryJSON,
  buildEditVehicle,
  updateVehicle,
  buildDeleteVehicle,
  deleteVehicle,
};
