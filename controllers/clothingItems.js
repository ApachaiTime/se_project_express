const mongoose = require("mongoose");
const { NotFoundError } = require("../middlewares/not-found-err");
const { UnauthorizedError } = require("../middlewares/unauth-err");
const { ConflictError } = require("../middlewares/conflict-err");
const { ForbiddenError } = require("../middlewares/forbidden-err");
const { BadRequestError } = require("../middlewares/bad-request-err");
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");
const { clothingItem } = require("../models/clothingItem");

const getClothingItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => {
      res.json(items);
    })
    .catch((err) => next(err));
};

const deleteSingleClothingItem = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
    return next(new BadRequestError("Invalid item ID"));
  }

  return clothingItem.findById(req.params._id).then((item) => {
    if (!item) {
      return next(new NotFoundError("Clothing item not found"));
    }
    if (!item.owner.equals(req.user._id)) {
      return next(new ForbiddenError("You can only delete your own items"));
    }

    return clothingItem
      .findByIdAndDelete(req.params._id)
      .then(() => res.json(item))

      .catch((err) => {
        if (err.name === "CastError") {
          return next(new NotFoundError("Clothing item not found"));
        }
        next(err);
      });
  });
};

const createClothingItem = (req, res, next) => {
  // handle creating a new clothing item
  clothingItem
    .create({
      name: req.body.name,
      weather: req.body.weather,
      owner: req.user._id,
      imageUrl: req.body.imageUrl,
      createdAt: new Date(),
    })
    .then((item) => res.status(201).res.json(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Failed to create clothing item invalid data fields"
          )
        );
      }
      next(err);
    });
};

module.exports = {
  deleteSingleClothingItem,
  createClothingItem,
  getClothingItems,
};
