const jwt = require('jsonwebtoken');
require('dotenv').config();
const invModel = require('../models/inventory-model');
const Util = {};


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul class="navigation_list">';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>';
    list += '</li>';
  });
  list += '</ul>';
  return list;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */

Util.buildInvIdItem = async function(data){
  let item = '';
  item += '<title>' + 'Vechicle Description'+ '</title>';
  if (data.length > 0) {
    data.forEach(vehicle => {
      item += '<h1>'+ vehicle.inv_year +' ' + vehicle.inv_make +' ' + vehicle.inv_model +'</h1>'
      item += '<div class="item-container">'
      item += '<div>'
      item +=
        '<img class="image-vehicle_view" src="' +
        vehicle.inv_image +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors"/></div>';
      item += '<div>'
      item += '<h2 class="h2-vehicle_view">' + vehicle.inv_make +' ' + 'Details' + '</h2>'
      item += '<span class="span-vehicle_price">Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span><br>'
      item +=
        '<br><span class="span-vehicle"><strong>Description:</strong>' +
        vehicle.inv_description +
        '</span><br>';
      item +=
        '<br><span class="span-vehicle"><strong>Color:</strong>' +
        vehicle.inv_color +
        '</span><br>';
      item +=
        '<br><span class="span-vehicle"><strong>Miles:</strong>' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_miles) +
        '</span><br>';
      item += '</div>'
      item += '</div>'
    });

  } else { 
    item += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return item
}


/* **************************************
* Build the list classification view HTML
* ************************************ */

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select class="detail" name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += ' selected ';
    }
    classificationList += '>' + row.classification_name + '</option>';
  });
  classificationList += '</select>';
  return classificationList;
};

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}


module.exports = Util;