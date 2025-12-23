const express = require("express");

const router = express.Router();
const {
  getClothingItems,
  deleteSingleClothingItem,
  createClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.delete("/:_id", deleteSingleClothingItem);
router.post("/", createClothingItem);

module.exports = router;
