const express = require("express");
const auth = require("../middlewares/auth");
const {
  clothingValidation,
  idValidation,
} = require("../middlewares/validation");

const router = express.Router();
const {
  getClothingItems,
  deleteSingleClothingItem,
  createClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.delete("/:_id", idValidation, auth, deleteSingleClothingItem);
router.post("/", auth, clothingValidation, createClothingItem);

module.exports = router;
