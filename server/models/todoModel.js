const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    dueDate:{
        type: Date,
        required: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'assignment_user',
        required: true
    },

}, { timestamps: true });

const todoModel  = mongoose.model('ToDo',todoSchema);
module.exports = todoModel;