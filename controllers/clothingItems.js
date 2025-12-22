const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const { clothingItem } = require("../models/clothingitem");

const getClothingItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => {
      res.json(items);
    })
    .catch(() => {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const deleteSingleClothingItem = (req, res) => {
  // handle deleting a single clothing item
  clothingItem
    .findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((clothingItem) => res.send({ clothingItem }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid clothing item ID" });
      } else if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Clothing item not found" });
      } else {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error occurred on the server" });
      }
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
    .then((clothingItem) => res.send({ clothingItem }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Failed to create clothing item" });
      } else {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error occurred on the server" });
      }
    });
};

module.exports = {
  deleteSingleClothingItem,
  createClothingItem,
  getClothingItems,
};
