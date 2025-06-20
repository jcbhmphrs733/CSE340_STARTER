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
    loggedIn: res.locals.loggedIn,
    account_firstname: res.locals.accountData
      ? res.locals.accountData.account_firstname
      : " Guest",
  });
}

/* ****************************************
 * Build inventory management view
 **************************************** */
async function buildFavorites(req, res) {
  const user_id = res.locals.accountData.account_id;
  const data = await invModel.getUserFavorites(user_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  res.render("./inventory/classification", {
    title: "Favorite vehicles",
    nav,
    grid,
    loggedIn: res.locals.loggedIn,
    account_firstname: res.locals.accountData
      ? res.locals.accountData.account_firstname
      : " Guest",
  });
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
async function buildDetail(req, res, next) {
  const invId = req.params.id;
  let vehicle = await invModel.getInventoryById(invId);
  let showFavorite = false; 
  if (res.locals.accountData && res.locals.accountData.account_id) {showFavorite = true;}
  
  const accountId = res.locals.accountData ? res.locals.accountData.account_id : null;
  const htmlData = await utilities.buildSingleVehicleDisplay(
    vehicle,
    showFavorite,
    accountId
  );
  let nav = await utilities.getNav();
  const vehicleTitle =
    vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model;
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    message: null,
    htmlData,
    loggedIn: res.locals.loggedIn,
    account_firstname: res.locals.accountData
      ? res.locals.accountData.account_firstname
      : " Guest",
    vehicle: invId,
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
    loggedIn: res.locals.loggedIn,
    account_firstname: res.locals.accountData
      ? res.locals.accountData.account_firstname
      : " Guest",
  });
}

// Add favorite
async function addFavorite(req, res) {
  try {
    const account_id =
      req.session.account_id || res.locals.accountData.account_id;
    const { inv_id } = req.body;
    if (!account_id) return res.status(401).json({ error: "Not logged in" });
    await invModel.addFavorite(account_id, parseInt(inv_id));
    res.status(200).json({ message: "Favorited" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
}

// Remove favorite
async function removeFavorite(req, res) {
  try {
    const account_id =
      req.session.account_id || res.locals.accountData.account_id;
    const { inv_id } = req.body;
    if (!account_id) return res.status(401).json({ error: "Not logged in" });
    await invModel.removeFavorite(account_id, parseInt(inv_id));
    res.status(200).json({ message: "Unfavorited" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
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
    loggedIn: res.locals.loggedIn,
    account_firstname: res.locals.accountData
      ? res.locals.accountData.account_firstname
      : " Guest",
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
    loggedIn: res.locals.loggedIn,
    account_firstname: res.locals.accountData
      ? res.locals.accountData.account_firstname
      : " Guest",
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
    loggedIn: res.locals.loggedIn,
    account_firstname: res.locals.accountData
      ? res.locals.accountData.account_firstname
      : " Guest",
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
    loggedIn: res.locals.loggedIn,
    account_firstname: res.locals.accountData
      ? res.locals.accountData.account_firstname
      : " Guest",
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
      loggedIn: res.locals.loggedIn,
      account_firstname: res.locals.accountData
        ? res.locals.accountData.account_firstname
        : " Guest",
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
  buildFavorites,
  addFavorite,
  removeFavorite,
};
