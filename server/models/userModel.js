const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    passwordHash: { type: String, required: true },
}, { timestamps: true });

const userModel = mongoose.model('assignment_user',userSchema);
module.exports = userModel;