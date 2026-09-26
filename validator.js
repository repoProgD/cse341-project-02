const { parse } = require('dotenv');
const { body, param, validationResult } = require('express-validator');
const allowedFields = ['country', 'capital', 'officialLanguages', 'continent', 'independenceDay',
    'governmentType', 'population', 'landAreaKm2'
];
const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']

const countryValidationRules = () => {
    return [
        body('country')
            .exists()
            .isString()
            .isLength({ min: 1, max: 50 })
            .matches(/^[\p{L} '-]+$/u),

        body('capital')
            .exists()
            .isString()
            .isLength({ min: 2, max: 50 })
            .matches(/^[\p{L} '.-]+$/u),

        body('officialLanguages')
            .exists()
            .isArray({ min: 1 })
            .custom((languages) => {
                return languages.every((language) =>
                    typeof language === 'string' && /^[\p{L} '-]{4,50}$/u.test(language)
                );
            })
            .withMessage('It must be a valid list of languages'),

        body('continent')
            .exists()
            .isString()
            .custom((continent) => {
                return continents.some(
                    (validContinent) => validContinent.toLowerCase() === continent.toLowerCase()
                );
            })
            .withMessage('It must be a valid continent name'),

        body('independenceDay')
            .exists()
            .custom((date) => {
                if (date === null) {
                    return true
                }

                if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                    return false;
                }

                const [year, month, day] = date.split('-').map(Number);
                const parseDate = new Date(Date.UTC(year, month - 1, day));

                if (
                    parseDate.getUTCFullYear() !== year ||
                    parseDate.getUTCMonth() !== month - 1 ||
                    parseDate.getUTCDate() !== day
                ) { return false; }

                const today = new Date();
                const todayUTC = Date.UTC(
                    today.getUTCFullYear(),
                    today.getUTCMonth(),
                    today.getUTCDate()
                );

                return parseDate.getTime() < todayUTC;
            })
            .withMessage('Date valid format: YYYY-MM-DD'),

        body('governmentType')
            .exists()
            .isString()
            .isLength({ min: 4, max: 50 })
            .matches(/^[\p{L} '-]+$/u)
            .withMessage('It must be a valid government type'),

        body('population')
            .exists()
            .isInt({ min: 1 })
            .withMessage('It must be a positive integer'),

        body('landAreaKm2')
            .exists()
            .isInt({ min: 1 })
            .withMessage('It must be a positive integer'),

        body().custom((value, { req }) => {
            const extrafields = Object.keys(req.body).filter(
                (field) => !allowedFields.includes(field)
            );

            if (extrafields.length > 0) {
                throw new Error(`Unknown field: ${extrafields.join(", ")}`);
            }

            return true;
        })

    ];
};

const countryUpdateValidationRules = () => {
    return [
        body('country')
            .isString()
            .isLength({ min: 1, max: 50 })
            .matches(/^[\p{L} '-]+$/u),

        body('capital')
            .isString()
            .isLength({ min: 2, max: 50 })
            .matches(/^[\p{L} '.-]+$/u),

        body('officialLanguages')
            .isArray({ min: 1 })
            .custom((languages) => {
                return languages.every((language) =>
                    typeof language === 'string' && /^[\p{L} '-]{4,50}$/u.test(language)
                );
            })
            .withMessage('It must be a valid list of languages'),

        body('continent')
            .isString()
            .custom((continent) => {
                return continents.some(
                    (validContinent) => validContinent.toLowerCase() === continent.toLowerCase()
                );
            })
            .withMessage('It must be a valid continent name'),

        body('independenceDay')
            .custom((date) => {
                if (date === null) {
                    return true
                }

                if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                    return false;
                }

                const [year, month, day] = date.split('-').map(Number);
                const parseDate = new Date(Date.UTC(year, month - 1, day));

                if (
                    parseDate.getUTCFullYear() !== year ||
                    parseDate.getUTCMonth() !== month - 1 ||
                    parseDate.getUTCDate() !== day
                ) { return false; }

                const today = new Date();
                const todayUTC = Date.UTC(
                    today.getUTCFullYear(),
                    today.getUTCMonth(),
                    today.getUTCDate()
                );

                return parseDate.getTime() < todayUTC;
            })
            .withMessage('Date valid format: YYYY-MM-DD'),

        body('governmentType')
            .isString()
            .isLength({ min: 4, max: 50 })
            .matches(/^[\p{L} '-]+$/u)
            .withMessage('It must be a valid government type'),

        body('population')
            .isInt({ min: 1 })
            .withMessage('It must be a positive integer'),

        body('landAreaKm2')
            .isInt({ min: 1 })
            .withMessage('It must be a positive integer'),

        body().custom((value, { req }) => {
            const extrafields = Object.keys(req.body).filter(
                (field) => !allowedFields.includes(field)
            );

            if (extrafields.length > 0) {
                throw new Error(`Unknown field: ${extrafields.join(", ")}`);;
            }

            return true;
        })

    ];
};


const idValidation = () => {
    return [
        param('id')
            .isMongoId()
            .withMessage('It must be a valid MongoDB ObjectId')
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(
        err => extractedErrors.push({
            field: err.path,
            message: err.msg
        })
    );

    return res.status(400).json({
        errors: extractedErrors,
    });
};

// -------------------------------------------------------------//
//                             USERS                            //
// -------------------------------------------------------------//

const userValidationRules = () => {
    return [
        body('firstName')
            .exists({ checkFalsy: true })
            .withMessage('First name is required')
            .isString()
            .withMessage('First name must be a string')
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2 and 50 characters')
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/)
            .withMessage('First name contains invalid characters'),

        body('lastName')
            .exists({ checkFalsy: true })
            .withMessage('Last name is required')
            .isString()
            .withMessage('Last name must be a string')
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters')
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/)
            .withMessage('Last name contains invalid characters'),

        body('email')
            .exists({ checkFalsy: true })
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email must be valid'),

        body('role')
            .exists({ checkFalsy: true })
            .withMessage('Role is required')
            .isIn(['user', 'admin'])
            .withMessage('Role must be user or admin')
    ];
};

const userUpdateValidationRules = () => {
    return [
        body('firstName')
            .isString()
            .withMessage('First name must be a string')
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2 and 50 characters')
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/)
            .withMessage('First name contains invalid characters'),

        body('lastName')
            .isString()
            .withMessage('Last name must be a string')
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters')
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/)
            .withMessage('Last name contains invalid characters'),

        body('email')
            .isEmail()
            .withMessage('Email must be valid'),

        body('role')
            .isIn(['user', 'admin'])
            .withMessage('Role must be user or admin'),

        body().custom((value) => {
            const allowedFields = ['firstName', 'lastName', 'email', 'role'];

            const unknownFields = Object.keys(value).filter(
                (field) => !allowedFields.includes(field)
            );

            if (unknownFields.length > 0) {
                throw new Error(`Unknown field(s): ${unknownFields.join(', ')}`);
            }

            return true;
        })
    ];
};

module.exports = {
    countryValidationRules,
    countryUpdateValidationRules,
    userValidationRules,
    userUpdateValidationRules,
    idValidation,
    validate
};