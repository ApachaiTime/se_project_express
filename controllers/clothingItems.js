const mongoose = require("mongoose");
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const { clothingItem } = require("../models/clothingItem");

const getClothingItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => {
      res.json(items);
    })
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" })
    );
};

const deleteSingleClothingItem = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item ID" });
  }

  // handle deleting a single clothing item
  return clothingItem
    .findByIdAndDelete(req.params._id)
    .orFail()
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Clothing item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const createClothingItem = (req, res) => {
  // handle creating a new clothing item
  clothingItem
    .create({
      name: req.body.name,
      weather: req.body.weather,
      owner: req.user._id,
      imageUrl: req.body.imageUrl,
      likes: req.body.likes,
      createdAt: new Date(),
    })
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({
          message: "Failed to create clothing item invalid data fields",
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = {
  deleteSingleClothingItem,
  createClothingItem,
  getClothingItems,
};
