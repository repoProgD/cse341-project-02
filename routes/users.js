const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

const {
    userValidationRules,
    userUpdateValidationRules,
    idValidation,
    validate
} = require('../validator');

router.get('/', usersController.getAll);

router.get('/:id', idValidation(), validate, usersController.getSingle);

router.post('/',
    userValidationRules(),
    validate,
    usersController.createUser);

router.put('/:id',
    idValidation(),
    userUpdateValidationRules(),
    validate,
    usersController.updateUser);

router.delete('/:id', idValidation(), validate, usersController.deleteUser);

module.exports = router;
