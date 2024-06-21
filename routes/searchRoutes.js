const express = require("express");
const {Search} = require('../controller/searchController');

const router = express.Router();


router.route("/text").post(Search);

module.exports = router;