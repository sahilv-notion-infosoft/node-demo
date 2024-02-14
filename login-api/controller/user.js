const { default: mongoose } = require('mongoose');
const model = require('../model/userModel')
const User = model.userSchema;
const jwt = require('jsonwebtoken');
exports.createUser = async (req, res, next) => {
    try {

        // Create a new product based on the request body
        const user = new User(req.body);
        var token = jwt.sign({ email: req.body.email }, 'shhhhh');
        user.token = token;


        // Save the product to the database
        await user.save();

        // Send a success response
        res.json(user);
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


