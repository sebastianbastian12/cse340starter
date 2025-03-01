const invModel = require('../models/inventory-model');
const Util = require('../utilities/');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/classification', {
    title: className + ' vehicles',
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build inventory by inv_id view
 * ************************** */

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const data = await invModel.getInventoryByInvId(inv_id);
  const item = await utilities.buildInvIdItem(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/vehicle', {
    title: className + ' vehicles',
    nav,
    item,
    errors: null,
  });
};


/* ****************************************
 *  Vehicle Management view
 * *************************************** */
async function buildVehicleManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render('./inventory/management', {
    title: 'Vehicle Management',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Add Classification view
 * *************************************** */
async function buildAddClassificationView(req, res, next) {
  let nav = await utilities.getNav();
  res.render('./inventory/add-classification', {
    title: 'Add New Classification',
    nav,
    errors: null,
  });
}

/* ****************************************
*  Process Add Classification
* *************************************** */
async function addClassification(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addClassificationDB(
  classification_name
  )

  if (regResult) {
    req.flash(
      'notice',
      `The ${classification_name} classification was successfully added.`
    );
    res.status(201).render('inventory/management', {
      title: 'Vehicle Management',
      nav,
      errors: null,

    });
  } else {
    req.flash("notice", "Sorry, the proccess failed.")
    res.status(501).render('/add-classification', {
      title: 'Add Classification',
      nav,
      errors: null,

    });
  }
}

/* ****************************************
 *  Add Inventory view
 * *************************************** */
 async function buildAddInventoryView (req, res, next) {
    const classification_id = req.params.classificationId;
   let nav = await utilities.getNav();
   let classificationList = await Util.buildClassificationList(classification_id);
   res.render('./inventory/add-inventory', {
     title: 'Add Vehicle',
     nav,
     classificationList,
     errors: null,
   });
 };

/* ****************************************
*  Process Add Inventory
* *************************************** */
async function addInventory (req, res) {
  let nav = await utilities.getNav();
  console.log("Mensaje de consola 2 " + req.body);
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

  const regResult = await invModel.addInventoryDB(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  );

  console.log("Mensaje de consola 3" + regResult);

  if (regResult) {
    req.flash(
      "notice",
      `The ${inv_make} car was successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the  failed.")
    res.status(501).render("/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
    })
  }
}

module.exports = {
  invCont,
  buildVehicleManagement,
  buildAddClassificationView,
  addClassification,
  buildAddInventoryView,
  addInventory
};
