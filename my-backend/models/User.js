/*const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Missing from the current schema
});


const User = mongoose.model('User', userSchema);

module.exports = User;
