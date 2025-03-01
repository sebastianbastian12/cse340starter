const utilities = require('.');
const { body, validationResult } = require('express-validator');
const validate = {};


/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */
  validate.addClassificationRules = () => {
    return [
      // classidication_name is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha('en-US')
        .matches(/^[a-zA-Z]+$/)
        .withMessage("Please provide a classification name with only alphabetic characters and not blank spaces."), // on error this message is sent.
    ]
  }


/* ******************************
 * Check data and return errors or continue to add the new classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
  *  Add Inventory Data Validation Rules
  * ********************************* */
  validate.addInventoryRules = () => {
    return [
      body('inv_make')
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage(
          'Please provide a make value with minimum 3 alphabetic characters.'
        ), // on error this message is sent.

      body('inv_model')
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage(
          'Please provide a model value with minimum 3 alphabetic characters.'
        ), // on error this message is sent.

      body('inv_description')
        .trim()
        .escape()
        .notEmpty()
        .withMessage(
          'Please provide a description value with minimum 1 characters.'
        ), // on error this message is sent.

      body('inv_image')
        .trim()
        .escape()
        .notEmpty()
        .withMessage(
          'Please provide a image path value like this format "/images/vehicles/dodge_muscle.jpg".'
        ), // on error this message is sent.

      body('inv_thumbnail')
        .trim()
        .escape()
        .notEmpty()
        .withMessage(
          'Please provide a image thumbnail path value like this format "/images/vehicles/dodge_muscle.jpg".'
        ), // on error this message is sent.

      body('inv_price')
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage(
          'Please provide a price value with only decimal o integer values.'
        ), // on error this message is sent.

      body('inv_year')
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ max: 4 })
        .withMessage(
          'Please provide a year value with only number values and maximum 4 digits.'
        ), // on error this message is sent.

      body('inv_miles')
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage('Please provide a miles value with only number values.'), // on error this message is sent.

      body('inv_color')
        .trim()
        .escape()
        .notEmpty()
        .isAlpha('en-US')
        .withMessage(
          'Please provide a color value with alphabetic characters only.'
        ), // on error this message is sent.
    ];
  }

  /* ******************************
 * Check data and return errors or continue to add the new inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
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
  } = req.body;

  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList();
    res.render('inventory/add-inventory', {
      errors,
      title: 'Add Inventory',
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return
  }
  next()
}


module.exports = validate