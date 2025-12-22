const express = require("express");
const router = express.Router();
const {
  getClothingItems,
  deleteSingleClothingItem,
  createClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.delete("/:itemId", deleteSingleClothingItem);
router.post("/", createClothingItem);

module.exports = router;
