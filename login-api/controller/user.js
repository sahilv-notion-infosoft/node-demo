const { default: mongoose } = require('mongoose');
const model = require('../model/userModel')
const User = model.userSchema;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path')
const bcrypt = require("bcrypt");

const privateKey = fs.readFileSync(path.resolve(__dirname, '../private.key'), 'utf-8')
exports.createUser = async (req, res, next) => {
    try {

        // Create a new product based on the request body
        const user = new User(req.body);
        var token = jwt.sign({ email: req.body.email }, privateKey, { algorithm: 'RS256' });
        user.token = token;
        // Save the product to the database
        await user.save();
        // Send a success response
        res.json('Create User Succesfully');
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Construct error object with specific error message
            const err = {};
            Object.values(error.errors).forEach(e => {
                err[e.path] = e.message;
            });
            return res.status(400).json(err);
        } else if (error.code === 11000 && error.keyPattern.email) {
            // Handle duplicate key error for email
            return res.status(400).json({
                success: false,
                code: 400,
                error: "Email already exists"
            });
        }
        // Pass other types of errors to the next middleware
        next(error);
    }

};


exports.loginUser = async (req, res) => {
    
    try {

        const user = await User.findOne({ email: req.body.email });
        const isAuth = bcrypt.compare(req.body.password, user.password);
        if (isAuth) {
            var token = jwt.sign({ email: req.body.email }, privateKey, { algorithm: 'RS256' });
            user.token = token;
            console.log(token)
            try {
                await user.save();
                res.json({ token });
            } catch (error) {
                // Handle the error
                console.error(error);
                // Respond with an error message
                res.status(500).json({ error: 'An error occurred while saving the user.' });
            }
        } else {
            res.sendStatus(401);
        }

        // res.status(201).json(doc);

    } catch (error) {
        console.log({ error });
        return res.status(401).json({
            success: false,
            code: 401,
            error: error
        });
    }

}