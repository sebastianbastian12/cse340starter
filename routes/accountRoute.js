// Needed Resources
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation');

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
  '/register',
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount));
  
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildSuccessLogView));

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get("/logout", utilities.handleErrors(accountController.accountLogout));

router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateView));

router.post("/update", utilities.checkLogin, utilities.handleErrors(accountController.updateAccount));

module.exports = router;