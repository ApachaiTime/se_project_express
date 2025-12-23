const { mongoose } = require("mongoose");
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const { clothingItem } = require("../models/clothingItem");

const likeItem = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item ID" });
  }
  return clothingItem
    .findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
};
const dislikeItem = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item ID" });
  }
  return clothingItem
    .findByIdAndUpdate(
      req.params._id,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
};
module.exports = {
  likeItem,
  dislikeItem,
};
