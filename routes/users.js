const express = require("express");
const {
  authValidation,
  userValidation,
  userUpdateValidation,
} = require("../middlewares/validation");
const {
  getCurrentUser,
  createUser,
  login,
  updateUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/users/me", auth, getCurrentUser);
router.post("/signin", authValidation, login);
router.post("/signup", userValidation, createUser);
router.patch("/users/me", userUpdateValidation, auth, updateUser);
module.exports = router;
