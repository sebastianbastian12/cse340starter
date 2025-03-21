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
  const classificationSelect = await utilities.buildClassificationList();
  res.render('./inventory/management', {
    title: 'Vehicle Management',
    nav,
    errors: null,
    classificationSelect
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
    classification_id
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
    classification_id
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render('inventory/edit-inventory', {
    title: 'Edit ' + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_year: itemData.inv_year,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(req, res, next){
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + ' ' + updateResult.inv_model;
    req.flash('notice', `The ${itemName} was successfully updated.`);
    res.redirect('/inv');
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash('notice', 'Sorry, the insert failed.');
    res.status(501).render('inventory/edit-inventory', {
      title: 'Edit ' + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
}


/* ***************************
 *  Build Delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,

  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
 invCont.deleteInventory = async function(req, res, next){
  let nav = await utilities.getNav();
  const {inv_id, inv_make, inv_model} = req.body;
  const updateResult = await invModel.deleteInventoryItem(inv_id);

  if (updateResult) {
    const itemName = updateResult.inv_make + ' ' + updateResult.inv_model;
    req.flash('notice', `The ${itemName} was successfully deleted.`);
    res.redirect('/inv');
  } else {
    const itemName = `${inv_make} ${inv_model}`;
    req.flash('notice', 'Sorry, the deletion failed.');
    res.status(501).render('inv/delete-confirm/inv_id', {
      title: 'Edit ' + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model
    });
  }
}


module.exports = {
  invCont,
  buildVehicleManagement,
  buildAddClassificationView,
  addClassification,
  buildAddInventoryView,
  addInventory,
  updateInventory,
};
