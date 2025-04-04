const { body } = require('express-validator');
validate = {};

 /* ***********************************
  *  City workshop rules
  * ********************************* */
  validate.cityRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body('city')
        .trim()
        .notEmpty().withMessage('A city is required.')
        .matches(/^[A-Za-z\s]+$/).withMessage('Only letters for the city is required.'),

      // password is required and must be strong password
      body('zipcode')
        .trim()
        .notEmpty().withMessage('A zipcode of 5 digits is required.')
        .isLength({ min: 5, max: 5 }).withMessage('The zipcode should be 5 digits only.')
        .isNumeric()
    ];
  }

module.exports = validate