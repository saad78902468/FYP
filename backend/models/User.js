const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: false },
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);


module.exports = User;
