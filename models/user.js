const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate(value) {
      return validator.isURL(value);
    },
    message: "You must enter a valid URL for the avatar.",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      return validator.isEmail(value);
    },
    message: "You must enter a valid email address.",
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("User not found"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect password"));
        }
        return user;
      });
    })
}

module.exports = mongoose.model("User", userSchema);
