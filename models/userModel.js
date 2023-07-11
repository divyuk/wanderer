const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
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
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
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
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // Saving in Db is slower then Creating JWT hence delay of 1sec
  next();
});
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
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

// Creating token for the password changed. Encypting using builtin package crypto
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Create a Model out of the Schema
const User = mongoose.model('User', userSchema);

module.exports = User;
