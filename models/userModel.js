const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    requrie: [true, 'Please confirm your password'],
    validate: {
      // This only works with Create and save!!!
      validator: function (el) {
        return this.password === el;
      },
      message: 'Password are not the same',
    },
  },
  passwordChangedAt: Date,
});

// Running a Middleware function between SAVE and write commands in Database.
// This is done to encrypt the password and not save the plain password in DB.
userSchema.pre('save', async function (next) {
  // Only run if password is modified
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  //after the user has confirmed the password above we dont need it
  this.passwordConfirm = undefined; // we dont want to save in DB
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

// Create a Model out of the Schema
const User = mongoose.model('User', userSchema);

module.exports = User;
