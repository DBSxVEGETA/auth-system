const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/", authController.listUsers);
router.get("/register", authController.showRegisterPage);
router.post("/register", authController.registerUser);
router.get("/login", authController.showloginPage);
router.post("/login", authController.loginUser);
router.get("/profile", authController.getProfile);
router.post("/logout", authController.logoutUser);

module.exports = router;
