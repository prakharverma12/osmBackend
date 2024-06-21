const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const client = require('twilio')(process.env.accountSid, process.env.authToken);
const axios = require('axios')

let OTP = "", hashedOTP;
const sendOTP = asyncHandler(async (req, res) => {
    const {phone} = req.body;
    const digits = "0123456789";
    
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    hashedOTP = await bcrypt.hash(OTP, await bcrypt.genSalt(10));
   
    await client.messages
    .create({
        from: +19192990300,
        to: '+91' + phone.toString(),
        body: `Your OTP for signup is ${OTP}`,
    })
    .then(()=> {
    })
    .catch(error => console.error('Error sending message:', error));
    
    return res.status(200).json({
        msg : "OTP sent successfully!",
        serverOTP :  hashedOTP});
});


let verification = 0;
const EnterOTP = asyncHandler(async (req, res) => {
    const {oTP} = req.body;
    verification = 0;
    
    await bcrypt.compare(oTP, hashedOTP).then((result) => {
        if(result == true){
            verification = 1;
            res
            .status(200)
            .json({
                msg : "OTP verified successfully!"})
        }
        else{
            throw new Error("Wrong OTP");
        }
        })
});

const verifyOTP = asyncHandler(async (req, res) => {
    const {phone} = req.body;
    console.log("reached verification");

    let serverOTP;
    await axios
    .post('http://localhost:3000/user/otp', req.body)
    .then((response) => {
        console.log(response.data);
        serverOTP = response.data.serverOTP;
    })
    .catch((error) => {
        console.log(error); 
    });

    console.log("OTP sent");
    
    console.log("verification status :"+verification);
    setTimeout(async() => {
        if(verification == 1)
        {
            return res.status(200).json({msg : "OTP verified!"});
        }
        
    }, 25000);
});         


module.exports = {sendOTP, verifyOTP, EnterOTP}