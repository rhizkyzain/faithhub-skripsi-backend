const express = require("express");
const authController = require("../../modules/user/user");

const router = express.Router();
router.route("/signup").post(authController.registerUser);
router.route("/signupAdmin").post(authController.registerAdmin);
router.route("/login").post(authController.login);
router.route("/getUsers").get(authController.getAllUsers);
// router.route('/logout').post(authController.protect, authController.logout);
router.route("/myProfile").get(authController.authMiddleware, authController.myProfile);
module.exports = router;