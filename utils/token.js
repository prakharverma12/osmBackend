const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const { generate } = require('otp-generator');
const createError = require("http-errors");


const UserToken = require("../models/userTokenModel")

require('dotenv').config();

const signAccessToken = (id) => {
  return new Promise((resolve, reject) => {
    const payload = { id };

    const secret = process.env.JWT_SECRET;

    const options = {
      expiresIn: "15s",
      issuer: "OneRealm",
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
}

const verifyAccessToken =  asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(createError.Unauthorized());
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return next(createError.Unauthorized());
      } else if (err.name === "TokenExpiredError") {
        return next(createError.Forbidden("Token Expired, Login again"));
      } else {
        return next(createError.Unauthorized());
      }
    }
    
    req.payload = payload;
    next();
  });
})

const signRefreshToken = (id) => {
  return new Promise((resolve, reject) => {
    const payload = { id };

    const secret = process.env.REFRESH_TOKEN_SECRET;

    const options = {
      expiresIn: "60d",
      issuer: "OneRealm",
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
}

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    const userToken = UserToken.findOne({ token: refreshToken });

    if (!userToken) {
      return reject(createError.Unauthorized());
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) return reject(createError.Unauthorized());
        const { id } = payload;
        resolve(id);
      }
    );
  });
}

const generateToken = async (id) => {
  try{
    const accessToken = await signAccessToken(id)
    const refreshToken = await signRefreshToken(id)

    await new UserToken({userId: id, token: refreshToken}).save();
    
    return Promise.resolve({accessToken, refreshToken})

  } catch(error){
    if(error){
      return Promise.reject(error)
    }
  }
}

const parseToken = (req) => {
    token = req.headers.authorization.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET);
    }



 
 module.exports = {
    generateToken,
    parseToken,
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
 };
 