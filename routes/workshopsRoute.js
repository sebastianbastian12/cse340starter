// Needed Resources
const express = require('express');
const router = new express.Router();
const {showWorkshopForm, searchWorkshops} = require('../controllers/workshopsController');
const utilities = require('../utilities');
const validation = require('../utilities/workshop-validation');

router.get('/', utilities.handleErrors(showWorkshopForm));

router.post('/search', validation.cityRules(), utilities.handleErrors(searchWorkshops));

module.exports = router;

