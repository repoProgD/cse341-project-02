const express = require('express');
const router = express.Router();

const countriesController = require('../controllers/countries');

const { 
    countryValidationRules,
    countryUpdateValidationRules,
    idValidation,
    validate 
} = require('../validator');

router.get('/', countriesController.getAll);

router.get('/:id', idValidation(), validate, countriesController.getSingle);

router.post('/',
    countryValidationRules(),
    validate,
    countriesController.createCountry);

router.put('/:id',
    idValidation(),
    countryUpdateValidationRules(),
    validate,
    countriesController.updateCountry);

router.delete('/:id', idValidation(), validate, countriesController.deleteCountry);

module.exports = router;
