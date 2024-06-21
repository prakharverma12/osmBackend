
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const sharedSecret = process.env.SHARED_SECRET;
const WebsitePath = process.env.PATH;

const bcrypt = require('bcryptjs');
const axios = require('axios')
const asyncHandler = require("express-async-handler");
const createError = require("http-errors");

const {User}  = require('../models/user'); 
const {isValidPhoneNumber} = require('../utils/phoneVerification');
const {tokenCookieOptions} = require('../utils/tokenCookieOptions');
const {verifyOTP} = require('../controller/OTPController')
const {generateToken} = require('../utils/token')



const userSignup = asyncHandler(async (req, res) => {
    const {name, userName, age, email, phone, password} = req.body;
    const existingUser = await User.findOne({phone});
    if(existingUser) {
        throw createError.Conflict('User already exists');
       
    }
    if(!isValidPhoneNumber(phone)) {
        throw createError.BadRequest('Invalid phone number');
      
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    await axios
    .post('http://localhost:3000/user/otp', req.body)
    .then(async(response) => {
        console.log(response.stauts);
        if(response.status != 200)
        {
            throw new Error("OTP incorrect");
        }
        const user = await User.create({
            name,
            userName,
            age,
            email,
            phone,
            password: hashedPassword,
            });
        const { accessToken, refreshToken } = await generateToken(user._id);
    
        res
        .status(200)
        .cookie("accessToken", accessToken, tokenCookieOptions)
        .cookie("refreshToken", refreshToken, tokenCookieOptions)
        .json({
        message: 'User created successfully',
        accessToken: accessToken,
        refreshToken: refreshToken
        });

    })
    .catch((error) => {
        console.log(error); //Logs a string: Error: Request failed with status code 404
    });

});


const loginUser = asyncHandler(async (req, res) => {
    // validating the body
  
    // checking for user existance
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      throw createError.NotFound("User not found");
    }
  
    const isPasswordCorrect = await bcrypt.compare(user.password, password);
  
    if (isPasswordCorrect) {
      throw createError.Unauthorized("Invalid Credentials");
    }
  
    const { accessToken, refreshToken } = await generateToken(user._id);
    if (!accessToken || !refreshToken) {
      throw createError.InternalServerError();
    }

  
    // checking if userToken exist and refreshing it
    //isSessionExists(req);
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, tokenCookieOptions)
      .cookie("refreshToken", refreshToken, tokenCookieOptions)
      .json({
        message: "User logged in successfully",
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
  });

const getParticipatedMatch = async (req, res) => {

    try {
        const user = req.user;
        const participatedMatch = user.participatedMatch;
        res.status(200).json({
            message: 'Participated Match Fetched',
            data: {
                participatedMatch
            }
        });

    } catch (error) {
        res.status(400).json({ message: error.message });

    }

}





const getUserProfile = asyncHandler(async (req, res) => {

    const {userName} = req.params;
    const user = await User.findOne({ userName });
    console.log(req);
    res.status(200).json({
        message:'User profile Fetched',
        data: {
            user
        } 
    });

    
});

const updateUserProfile = async (req, res) => {
    try {
        const user = req.user;
        const {avatar,name,userName, email, phone} = req.body;
        user.avatar = avatar;
        user.name = name;
        user.userName = userName;
        user.email = email;
        user.phone = phone;
        await user.save();
        res.status(200).json({
            message:'User profile updated',
            data: {
                user
            }
        });

    } catch (error) {
        res.status(400).json({message: error.message});

    }
}


module.exports = {
    updateUserProfile,
    loginUser,
    userSignup,
    getParticipatedMatch,
    getUserProfile
}