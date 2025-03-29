// Needed Resources
const express = require('express');
const router = new express.Router();
const {invCont, buildVehicleManagement, buildAddClassificationView, addClassification, buildAddInventoryView, addInventory, updateInventory} = require('../controllers/invController');
const utilities = require('../utilities');
const regValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", invCont.buildByClassificationId);
router.get("/detail/:inv_id", invCont.buildByInvId);

router.get("/management", utilities.checkLogin, utilities.checkAccountType, buildVehicleManagement);
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, buildAddClassificationView);
router.get("/add-inventory",utilities.checkLogin, utilities.checkAccountType, buildAddInventoryView);

router.post("/add-classification", utilities.checkLogin, utilities.checkAccountType, regValidate.addClassificationRules(), regValidate.checkClassificationData, utilities.handleErrors(addClassification));
router.post(
  '/add-inventory', utilities.checkLogin, utilities.checkAccountType,
  regValidate.addInventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(addInventory)
);

router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invCont.getInventoryJSON)
);

router.get('/edit/:inv_id', utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invCont.editInventoryView));
router.get('/delete/:inv_id', utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invCont.deleteInventoryView));

router.post('/update/', utilities.checkLogin, utilities.checkAccountType, regValidate.addInventoryRules(), regValidate.checkUpdateData, utilities.handleErrors(updateInventory));
router.post('/delete/', utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invCont.deleteInventory));


module.exports = router;