const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'assignment_user',
    required: true
  },
  type: {
    type: String,
    enum: ['refresh', 'access'],
    required: true
  },
  blacklisted: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;