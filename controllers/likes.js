const { NotFoundError } = require("../utils/errors/not-found-err");
const { clothingItem } = require("../models/clothingItem");

const likeItem = (req, res, next) =>
  clothingItem
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

const dislikeItem = (req, res, next) =>
  clothingItem
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

module.exports = {
  likeItem,
  dislikeItem,
};
