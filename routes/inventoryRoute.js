// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

/* ****************************************
 * Route to build vehicle management views
 **************************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildInventoryManagement)
);
router.get("/favorites", utilities.checkLogin, utilities.handleErrors(invController.buildFavorites));
router.get(
  "/getInventory/:classification_id",
  utilities.checkAdmin,
  utilities.handleErrors(invController.getInventoryJSON)
);
router.get(
  "/newClassification",
  utilities.checkAdmin,
  utilities.handleErrors(invController.buildNewClassification)
);
router.get(
  "/newVehicle",
  utilities.checkAdmin,
  utilities.handleErrors(invController.buildNewVehicle)
);
router.post(
  "/newClassification",
  utilities.checkAdmin,
  utilities.handleErrors(invController.addNewClassification)
);
router.post(
  "/newVehicle",
  utilities.checkAdmin,
  utilities.handleErrors(invController.addNewVehicle)
);
router.post(
  "/update",
  utilities.checkLogin,
  utilities.checkAdmin,
  utilities.handleErrors(invController.updateVehicle)
);
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.checkAdmin,
  utilities.handleErrors(invController.deleteVehicle)
);

/* ****************************************
 * Route to build vehicle classification view
 **************************************** */
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

/* ****************************************
 * Route to build vehicle detail view
 **************************************** */
router.get("/detail/:id", utilities.handleErrors(invController.buildDetail));

/* ****************************************
 * Route to build vehicle edit and delete views
 **************************************** */
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkAdmin,
  utilities.handleErrors(invController.buildEditVehicle)
);
router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkAdmin,
  utilities.handleErrors(invController.buildDeleteVehicle)
);


router.post("/favorites", utilities.checkLogin, utilities.handleErrors(invController.addFavorite));
router.delete("/favorites", utilities.checkLogin, utilities.handleErrors(invController.removeFavorite));


module.exports = router;
