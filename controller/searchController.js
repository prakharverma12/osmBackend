const asyncHandler = require("express-async-handler");
const {Match} = require('../models/match');


const Search = asyncHandler(async (req, res) => {

    const {matchName} = req.body;
    const query = await Match.find({ $text: { $search: matchName } });

    res.status(200).json({data: query});
});



module.exports = {Search};