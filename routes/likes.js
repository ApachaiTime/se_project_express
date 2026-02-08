const express = require("express");
const auth = require("../middlewares/auth");
const { idValidation} = require("../middlewares/validation");

const router = express.Router();
const { likeItem, dislikeItem } = require("../controllers/likes");

router.put("/:_id/likes", idValidation, auth, likeItem);
router.delete("/:_id/likes", idValidation, auth, dislikeItem);
module.exports = router;
