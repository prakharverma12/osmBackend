const Match = require('../models/match').Match;
const {User}  = require('../models/user'); 



const asyncHandler = require("express-async-handler");
const createMatch = async(req,res) => {
    try {
        const {name,
            date,
            time,
            organizer,
            category,
            price,
            maxPlayers,
            currentPlayers} = req.body;
        const match = new Match({
            name,
            date,
            time,
            organizer,
            category,
            price,
            maxPlayers,
            currentPlayers
        });
        await match.save();
        res.status(200).json({
            message: 'Match Created',
            data: {
                match
            }
        });
    }
    catch(error) {
        res.status(400).json({message: error.message});
    }   
}

const registerMatch = asyncHandler(async (req, res) => {
    console.log(req);
    const {matchid} = req.params._id;
    const {phone } = req.body;
    const user = await User.findOne({phone});
    const match = await Match.findOne({_id: matchid});
    user.participatedMatch.push(match);
    await user.save();
    res.status(200).json({
        message: 'Match Registered',
        data: {
            user
        }
    });
    
});

module.exports = {createMatch, registerMatch}