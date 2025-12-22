const express = require("express");
const router = express.Router();
const { likeItem, dislikeItem } = require("../controllers/likes");
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
module.exports = router;
