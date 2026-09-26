const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

const {
    userValidationRules,
    userUpdateValidationRules,
    idValidation,
    validate
} = require('../validator');

const { isAuthenticated } = require("../middleware/authenticate");

router.get('/', usersController.getAll);

router.get('/:id', idValidation(), validate, usersController.getSingle);

router.post('/',
    userValidationRules(),
    validate,
    isAuthenticated,
    usersController.createUser);

router.put('/:id',
    idValidation(),
    userUpdateValidationRules(),
    validate,
    isAuthenticated,
    usersController.updateUser);

router.delete('/:id', idValidation(), validate, isAuthenticated, usersController.deleteUser);

module.exports = router;
