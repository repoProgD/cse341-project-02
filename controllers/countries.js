const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
    //# swagger.tags = ['Countries']
    try {
        //throw new Error('Test error');
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('countries')
            .find();
        
        const countries = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(countries);
        
    } catch (error) {
        next(error);
    }
};

const getSingle = async (req, res, next) => {
    //# swagger.tags = ['Countries']
    try {
        const countryId = new ObjectId(req.params.id);
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('countries')
            .find({ _id: countryId });

        const countries = await result.toArray();
            
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(countries);
    
    } catch (error) { 
        next(error);
    }
};

const createCountry = async (req, res, next) => {
    //# swagger.tags = ['Countries']
    try {
        const country = {
            country: req.body.country,
            capital: req.body.capital,
            officialLanguages: req.body.officialLanguages,
            continent: req.body.continent,
            independenceDay: req.body.independenceDay,
            governmentType: req.body.governmentType,
            population: req.body.population,
            landAreaKm2: req.body.landAreaKm2
        };

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('countries')
            .insertOne(country);

        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json('Some error occurred while creating the country.');
            }
    } catch (error){ 
        next(error);
    }
};

const updateCountry = async (req, res, next) => {
    //# swagger.tags = ['Countries']
    try {
        const countryId = new ObjectId(req.params.id);

        const country = {
            country: req.body.country,
            capital: req.body.capital,
            officialLanguages: req.body.officialLanguages,
            continent: req.body.continent,
            independenceDay: req.body.independenceDay,
            governmentType: req.body.governmentType,
            population: req.body.population,
            landAreaKm2: req.body.landAreaKm2
        };
        
        const response = await mongodb
            .getDatabase()
            .db()
            .collection('countries')
            .updateOne(
                { _id: countryId },
                { $set: country } 
            );
        
        if (response.matchedCount === 0) {
            res.status(404).json('Country not found.');
        } else {
            res.status(204).send();
        }
    } catch (error) { 
        next(error);
    }
};

const deleteCountry = async (req, res, next) => {
    //# swagger.tags = ['Countries']
    try {
        const countryId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('countries')
            .deleteOne({ _id: countryId });

        if (response.deletedCount === 0) {
            res.status(404).json('Country not found.');
        } else {
            res.status(204).send();
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getSingle,
    createCountry,
    updateCountry,
    deleteCountry
};


