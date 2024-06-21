const express = require("express");
const router = express.Router();

const {
  getNewRefreshToken,
  deleteRefreshToken,
} = require("../controller/refreshTokenController");

router.route("/").get(getNewRefreshToken);
router.route("/").delete(deleteRefreshToken);

module.exports = router;
