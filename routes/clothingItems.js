const express = require("express");
const auth = require("../middlewares/auth");

const router = express.Router();
const {
  getClothingItems,
  deleteSingleClothingItem,
  createClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.delete("/:_id", auth, deleteSingleClothingItem);
router.post("/", auth, createClothingItem);

module.exports = router;
