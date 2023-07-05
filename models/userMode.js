const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
// Creating a Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please tell your name'],
  },
  email: {
    type: String,
    require: [true, 'Please write email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please write a valid Email'],
  },
  photo: String,
  password: {
    type: String,
    require: [true, 'Please a Provide Password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    requrie: [true, 'Please confirm your password'],
  },
});

// Create a Model out of the Schema
const User = mongoose.model('User', userSchema);

module.exports = User;
