const express = require("express");
const router = express.Router();

const { verifyAccessToken } = require("../utils/token");
const { createMatch, registerMatch } = require("../controller/matchController");


router.route("/create").post(verifyAccessToken, createMatch);
router.route("/register/:_id").post(verifyAccessToken, registerMatch);

module.exports = router;
