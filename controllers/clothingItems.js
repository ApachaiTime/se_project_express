const { NotFoundError } = require("../utils/errors/not-found-err");
const { ForbiddenError } = require("../utils/errors/forbidden-err");
const { BadRequestError } = require("../utils/errors/bad-request-err");
const { clothingItem } = require("../models/clothingItem");

const getClothingItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => {
      res.json(items);
    })
    .catch((err) => next(err));
};

const deleteSingleClothingItem = (req, res, next) =>
  clothingItem.findById(req.params._id).then((item) => {
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
        return next(err);
      });
  });
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
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
       return next(
          new BadRequestError(
            "Failed to create clothing item invalid data fields"
          )
        );
      }
      return next(err);
    });
};

module.exports = {
  deleteSingleClothingItem,
  createClothingItem,
  getClothingItems,
};
