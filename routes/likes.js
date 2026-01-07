const express = require("express");
const auth = require("../middlewares/auth");

const router = express.Router();
const { likeItem, dislikeItem } = require("../controllers/likes");

router.put("/:_id/likes", auth, likeItem);
router.delete("/:_id/likes", auth, dislikeItem);
module.exports = router;
