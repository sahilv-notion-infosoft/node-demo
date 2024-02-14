const { default: mongoose } = require('mongoose');
const model = require('../model/productModel')
const Product = model.Product;

exports.createProduct = async (req, res, next) => {
    try {
        // Create a new product based on the request body
        const product = new Product(req.body);

        // Save the product to the database
        await product.save();

        // Send a success response
        res.json(product);
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Construct error object with specific error message
            const err = {};
            Object.values(error.errors).forEach(e => {
                err[e.path] = e.message;
            });
            return res.status(400).json(err);
        }
        // Pass other types of errors to the next middleware
        next(error);
    }

};


exports.getAllProducts = async (req, res) => {
    const product = await Product.find();
    res.json({data:product});
};
exports.getProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id);
        if (!mongoose.isValidObjectId(id)) {
            // If the provided ID is not valid, return a 404 status code
            return res.status(404).json({ error: 'Invalid product ID' });
        }
        const product = await Product.findById(id);
        if (!product) {
            // If no product is found with the given ID, return a 404 status code
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        // If an error occurs, pass it to the error handling middleware
        next(error);
    }
};


exports.updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const update = req.body; // Assuming the update data is sent in the request body

        // Validate the ID format
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        // Find the product by ID and update it
        const updatedProduct = await Product.findByIdAndUpdate(id, update, { new: true });

        // Check if the product exists
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // If the product is updated successfully, send it as a response
        res.json(updatedProduct);
    } catch (error) {
        // If an error occurs, pass it to the error handling middleware
        next(error);
    }
};


exports.deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;

        // Validate the ID format
        if (!mongoose.isValidObjectId(id)) {
            const error = new Error('Invalid product ID');
            error.status = 400;
            throw error;
        }

        // Find the product by ID and delete it
        const deletedProduct = await Product.findByIdAndDelete(id);

        // If the product is not found, throw a 404 error
        if (!deletedProduct) {
            const error = new Error('Product not found');
            error.status = 404;
            throw error;
        }

        // If the product is deleted successfully, send a success message
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        // Pass the error to the next middleware
        next(error);
    }
};