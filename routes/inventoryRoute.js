// Needed Resources
const express = require('express');
const router = new express.Router();
const {invCont, buildVehicleManagement, buildAddClassificationView, addClassification, buildAddInventoryView, addInventory, updateInventory, deleteInventory} = require('../controllers/invController');
const utilities = require('../utilities');
const regValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", invCont.buildByClassificationId);
router.get("/detail/:inv_id", invCont.buildByInvId);
router.get("/", buildVehicleManagement);
router.get("/add-classification", buildAddClassificationView);
router.get("/add-inventory", buildAddInventoryView);

router.post("/add-classification", regValidate.addClassificationRules(), regValidate.checkClassificationData, utilities.handleErrors(addClassification));
router.post(
  '/add-inventory',
  regValidate.addInventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(addInventory)
);

router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invCont.getInventoryJSON)
);

router.get('/edit/:inv_id', utilities.handleErrors(invCont.editInventoryView));
router.get('/delete/:inv_id', utilities.handleErrors(invCont.deleteInventoryView));

router.post('/update/', regValidate.addInventoryRules(), regValidate.checkUpdateData, utilities.handleErrors(updateInventory));
router.post('/delete/', utilities.handleErrors(invCont.deleteInventory));


module.exports = router;