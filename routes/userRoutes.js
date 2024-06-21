const express = require("express");

const {
  updateUserProfile,
  loginUser,
  userSignup,
  getParticipatedMatch,
  getUserProfile
} = require('../controller/userController');

const {
  sendOTP,
  verifyOTP, 
  EnterOTP
} = require('../controller/OTPController')

const { verifyAccessToken } = require("../utils/token");

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(userSignup);
router.route("/otp").post(sendOTP);
router.route("/otp/enter").post(EnterOTP);
router.route("/otp/verify").post(verifyOTP);
router.route("/participatedMatch").post(verifyAccessToken, getParticipatedMatch);
router.route("/profile").get(verifyAccessToken, getUserProfile);

/*
router
.route("/")
  .patch(verifyAccessToken, updateUser)
  .delete(verifyAccessToken, deleteUser)
  .get(verifyAccessToken, userProfile);
*/
module.exports = router;
