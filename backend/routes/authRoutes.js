const express = require("express");
const router = express.Router();
const {
  register, login, getProfile, updateProfile, deleteProfile,
  forgotPassword, resetPassword, verifyEmail
} = require("../controllers/authController");
const protect = require("../middleWares/authMiddleware");

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.delete("/me", protect, deleteProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
