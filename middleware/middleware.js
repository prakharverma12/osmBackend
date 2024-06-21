const parseToken = require('../utils/token').parseToken;
const { User } = require('../models/user');
const { Organizer } = require('../models/organizer');


const isUserLogin = async (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Token is required' });
    }
    try{

    const token = parseToken(req);
    const user = await User.findById(token.id);

    if (!user) {
        return res.status(401).json({ message: 'User does not exist' });
    }
    req.user = user;
    next();
} catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
}


}

const isOrganizerLogin = async (req,res,next)=>{
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Token is required' });
    }
    try{

    const token = parseToken(req);
    const organizer = await Organizer.findById(token.id);

    if (!organizer) {
        return res.status(401).json({ message: 'Organizer does not Exist' });
    }
    req.organizer = organizer;
    next();



    }catch(error){
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = {
    isUserLogin,
    isOrganizerLogin
}