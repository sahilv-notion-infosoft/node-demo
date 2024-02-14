const express = require('express');
const server = express();
const mongoose = require('mongoose');
const productRouter = require('./routes/product')
const userRouter = require('./routes/user')
const jwt = require('jsonwebtoken');



const { Schema } = mongoose;

require('dotenv').config()


console.log('env', process.env.DB_PASSWORD)
//db connection
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://SahilNode:Sahil1v@cluster0.degvfkp.mongodb.net/ecommerceDatabase');
    console.log('database connected succsfully');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
server.use((req, res, next) => {
try {
    const token = req.get('Authorization').split('Bearer ')[1];
    console.log(token);
    var decode = jwt.verify(token, process.env.SECRET);
    console.log(decode);
    if (decode.email) {
        next()
    } else {
        res.sendStatus(401)
    }
} catch (error) {
    res.sendStatus(401)

}
});


   




server.use(express.urlencoded({ extended: true }));

server.use(express.json());




// server.post('/formdata', productController.createProduct);


// server.use(express.json());
server.use('/products', productRouter.router);
server.use('/user', userRouter.router);
// Initialize Express app
const PORT = 8080;


// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});