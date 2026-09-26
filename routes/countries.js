const express = require('express');
const router = express.Router();

const countriesController = require('../controllers/countries');

const { 
    countryValidationRules,
    countryUpdateValidationRules,
    idValidation,
    validate 
} = require('../validator');

const { isAuthenticated } = require("../middleware/authenticate");

router.get('/', countriesController.getAll);

router.get('/:id', idValidation(), validate, countriesController.getSingle);

router.post('/',
    countryValidationRules(),
    validate, isAuthenticated,
    countriesController.createCountry);

router.put('/:id',
    idValidation(),
    countryUpdateValidationRules(),
    validate, isAuthenticated,
    countriesController.updateCountry);

router.delete('/:id', idValidation(), validate, isAuthenticated, countriesController.deleteCountry);

module.exports = router;
