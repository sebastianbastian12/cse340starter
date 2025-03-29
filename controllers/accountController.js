const jwt = require('jsonwebtoken');
require('dotenv').config();
const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/login', {
    title: 'Login',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/register', {
    title: 'Register',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver Log Success view
 * *************************************** */
async function buildSuccessLogView(req, res, next) {
  try{
    const accountData = res.locals.accountData;
    let nav = await utilities.getNav();
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      accountData,
      account_type: accountData.account_type,
      error: null,
    });
  } catch(error) {
    next(error);
  }
};

/****************************************
 *  Process Registration
 ***************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      'notice',
      'Sorry, there was an error processing the registration.'
    );
    res.status(500).render('account/register', {
      title: 'Registration',
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      'notice',
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );

    res.status(201).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
    });
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    res.status(501).render('account/register', {
      title: 'Registration',
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      console.log('Testing the fuction');
      delete accountData.account_password
      const accessToken = jwt.sign (
        {
          account_id: accountData.account_id,
          account_firstname: accountData.account_firstname,
          account_type: accountData.account_type,
        },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: 3600 * 1000}
      );
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


async function accountLogout (req, res, next) {
  res.clearCookie("jwt")
  req.flash("message notice", "You have been logged out.")
  res.redirect("/account/login")
}

async function buildUpdateView (req, res, next) {
  try {
    const account_id = parseInt(req.params.account_id);
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);
      

      if (!accountData){
        res.flash("Message notice", "Account not found");
        return res.redirect("/account/")
      }
      res.render("account/update-account", {
        title: "Update Account",
        nav,
        accountData,
        errors: null,
      });
  } catch (error) {
    next(error);
  }
};

async function updateAccount (req, res, next) {
  try {
    const {
      account_id,
      account_firstname,
      account_lastname,
      account_email
    } = req.body;

  const updateResult = await accountModel.updateAccount (
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult){
    if (res.locals.accountData.account_id == account_id) {
      res.locals.accountData.account_firstname = account_firstname;
      res.locals.accountData.account_lastname = account_lastname;
      res.locals.accountData.account_email = account_email;
    }

    req.flash("Message notice", "Account updated successfully!");
    res.redirect("/account/");

  } else {
    res.flash("Message notice", "Sorry, the update failed.");
    res.redirect(`/account/update/${account_id}`);
  }
  } catch (error) {
    next(error);
  }
}



module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildSuccessLogView,
  accountLogout,
  buildUpdateView,
  updateAccount
};
