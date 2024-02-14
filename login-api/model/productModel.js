const mongoose = require('mongoose');
const { Schema } = mongoose;

const products = new Schema({
    title: { type: String, required: true }, // String is shorthand for {type: String}
    // des: String,
    price: { type: Number, min: [1, 'wrong price'] },
    brand: {type: String, required: true },
    // discount: Number,
    rating: Number,
    // catg: String

});

exports.Product = mongoose.model('Product', products);

