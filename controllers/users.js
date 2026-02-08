const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { NotFoundError } = require("../middlewares/not-found-err");
const { UnauthorizedError } = require("../middlewares/unauth-err");
const { ConflictError } = require("../middlewares/conflict-err");
const { BadRequestError } = require("../middlewares/bad-request-err");

const user = require("../models/user");

const login = (req, res, next) => {
  // handle user login
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Email and password must be provided");
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
        return next(new UnauthorizedError("Invalid email or password"));
      }

      if (err.message === "Incorrect password") {
        return next(new UnauthorizedError("Invalid email or password"));
      }

      return next(err);
    });
};

const updateUser = (req, res, next) => {
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
        return next(new BadRequestError("Invalid data provided for update"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  // handle returning users
  user
    .findById(req.user._id)

    .then((currentUser) => {
      if (currentUser == null) {
        throw new NotFoundError("User not found");
      }
      res.json(currentUser);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }

      return next(err);
    });
};

const createUser = (req, res, next) =>
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
      res.status(201).res.json(createdUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }

      if (err.name === "MongoServerError" && err.code === 11000) {
        return next(new ConflictError("Email already in use"));
      }

      return next(err);
    }); // Debugging

module.exports = { getCurrentUser, createUser, login, updateUser };
