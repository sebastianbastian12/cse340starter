// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inv_id", invController.buildByInvId);
router.get("/serverError/", invController.buildByInvId);


module.exports = router;