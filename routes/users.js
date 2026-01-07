const express = require("express");
const {
  getUsers,
  getCurrentUser,
  createUser,
  login,
  updateUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/users", auth, getUsers);
router.get("/users/me", auth, getCurrentUser);
router.post("/signin", login);
router.post("/signup", createUser);
router.patch("/users/me", auth, updateUser);
module.exports = router;
