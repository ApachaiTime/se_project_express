const mongoose = require("mongoose");
const { NotFoundError } = require("../middlewares/not-found-err");
const { BadRequestError } = require("../middlewares/bad-request-err");

const { clothingItem } = require("../models/clothingItem");

const likeItem = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
    throw new BadRequestError("Invalid item ID");
  }
  return clothingItem
    .findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      return next(err);
    });
};
const dislikeItem = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
    throw new BadRequestError("Invalid item ID");
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
        return next(new NotFoundError("Item not found"));
      }
      return next(err);
    });
};
module.exports = {
  likeItem,
  dislikeItem,
};
