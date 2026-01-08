const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
} = require("../utils/errors");
const user = require("../models/user");

const login = (req, res) => {
  // handle user login
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "Email and password must be provided" });
  }
  return user
    .findUserByCredentials(email, password)
    .then((userCred) => {
      const token = jwt.sign({ _id: userCred._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "User not found") {
        return res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: "Invalid email or password" });
      }

      if (err.message === "Incorrect password") {
        return res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: "Invalid email or password" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const updateUser = (req, res) => {
  user
    .findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, avatar: req.body.avatar },
      { new: true, runValidators: true }
    )
    .orFail()
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid data provided for update" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  // handle returning users

  user
    .findById(req.user._id)
    .orFail()
    .then((currentUser) => {
      res.json(currentUser);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const createUser = (req, res) =>
  // handle user creation
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      user.create({
        name: req.body.name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
    )
    .then((newUser) => {
      const createdUser = newUser.toObject();
      delete createdUser.password;
      res.json(createdUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid data provided" });
      }

      if (err.name === "MongoServerError" && err.code === 11000) {
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "Email already in use" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    }); // Debugging

module.exports = { getCurrentUser, createUser, login, updateUser };
