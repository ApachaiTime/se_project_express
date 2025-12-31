const userSchema = require("../models/user");
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  userSchema
    .find({})
    .then((users) => res.json(users))

    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "An error occurred getting users" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
      // handle rendering users
    });
};

const getUser = (req, res) => {
  // handle returning users
  userSchema
    .findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.json(user);
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

const createUser = (req, res) => {
  // handle user creation
  const { name, avatar } = req.body;

  userSchema
    .create({ name, avatar })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    }); // Debugging
};

module.exports = { getUsers, getUser, createUser };
