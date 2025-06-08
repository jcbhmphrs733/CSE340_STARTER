// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

/* ****************************************
 * Route to build vehicle management views
 **************************************** */
router.get("/", utilities.checkLogin, utilities.handleErrors(invController.buildInventoryManagement));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
router.get("/newClassification", utilities.handleErrors(invController.buildNewClassification));
router.get("/newVehicle", utilities.handleErrors(invController.buildNewVehicle));
router.post("/newClassification", utilities.handleErrors(invController.addNewClassification));
router.post("/newVehicle", utilities.handleErrors(invController.addNewVehicle));
router.post("/update", utilities.handleErrors(invController.updateVehicle));

/* ****************************************
 * Route to build vehicle classification view
 **************************************** */
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
 
 
/* ****************************************
 * Route to build vehicle detail view
 **************************************** */
router.get("/detail/:id",
utilities.handleErrors(invController.buildDetail))

/* ****************************************
* Route to build vehicle edit view
**************************************** */
router.get("/edit/:inv_id", utilities.checkLogin, utilities.handleErrors(invController.buildEditVehicle));
 
module.exports = router;