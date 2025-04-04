const { validationResult } = require('express-validator');
const workshopModel = require('../models/workshop-model');
const utilities = require('../utilities');


/* ***************************
 *  Build The Workshop Form View
 * ************************** */
async function showWorkshopForm (req, res, next) {
    let nav = await utilities.getNav();
    res.render('workshops/form', {
        title: 'Find a Workshop',
        nav,
        errors: null,
    });
};

/* ***************************
 *  Processing The Workshop Searching
 * ************************** */
 async function searchWorkshops (req, res, next) {
    const {city, zipcode} = req.body;
    const errors = validationResult(req);
    let nav = await utilities.getNav();

    if(!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.render('workshops/form', {
            title: 'Find a Workshop',
            nav,
            errors: null,
            city,
            zipcode
        });

    }

  try {
        const workshops = await workshopModel.getWorkshopsByLocation(
          city,
          zipcode
        );

        if (workshops.length === 0) {
            req.flash('notice', `No workshops found in  City ${city} and zipcode ${zipcode}`);
            return res.redirect('/workshops');
        }

        res.render('workshops/list', {
            title: 'Workshop Found',
            nav, 
            workshops,
            city,
            zipcode,
            errors: null,
        });

    } catch (error) {
        req.flash('error', 'Sorry, the search failed. Please try again.');
        console.error("Search error:", error);
        res.redirect('/workshops');
    }
};

module.exports = {showWorkshopForm, searchWorkshops};