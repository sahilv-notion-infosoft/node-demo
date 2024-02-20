const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String, unique: true, validate: {
            validator: function (v) {
                return emailRegexp;
            },
            message: (props) => `${props.value} is not a valid email`,
        },
        require: true,
    },
    password: { type: String, minLength: 6, required: true },
    token: String,
});

// method ne call karvi pade but jo schema save karta pahela kaik change karvo hoy to schema.pre() method no use karvo

userSchema.pre('save', async function(next) {
    const password = await bcrypt.hash(this.password, 12);
    this.password = password;
    next()
});

exports.userSchema = mongoose.model('User',userSchema);