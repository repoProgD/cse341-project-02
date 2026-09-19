const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
    //# swagger.tags = ['users']
    try {
        //throw new Error('Test error');
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('users')
            .find();
        
        const users = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
        
    } catch (error) {
        next(error);
    }
};

const getSingle = async (req, res, next) => {
    //# swagger.tags = ['users']
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('users')
            .find({ _id: userId });

        const users = await result.toArray();
            
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    
    } catch (error) { 
        next(error);
    }
};

const createUser = async (req, res, next) => {
    //# swagger.tags = ['users']
    try {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role
        };

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('users')
            .insertOne(user);

        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json('Some error occurred while creating the user.');
            }
    } catch (error){ 
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    //# swagger.tags = ['users']
    try {
        const userId = new ObjectId(req.params.id);

        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role
        };
        
        const response = await mongodb
            .getDatabase()
            .db()
            .collection('users')
            .updateOne(
                { _id: userId },
                { $set: user }
            );
        
        if (response.matchedCount === 0) {
            res.status(404).json('user not found.');
        } else {
            res.status(204).send();
        }
    } catch (error) { 
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    //# swagger.tags = ['users']
    try {
        const userId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('users')
            .deleteOne({ _id: userId });

        if (response.deletedCount === 0) {
            res.status(404).json('user not found.');
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
    createUser,
    updateUser,
    deleteUser
};


