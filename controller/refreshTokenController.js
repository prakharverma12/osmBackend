const expressAsyncHandler = require("express-async-handler");
const createError = require("http-errors");


const { verifyRefreshToken, generateToken } = require("../utils/token");
const UserToken = require("../models/userTokenModel");
const tokenCookieOptions = require("../utils/tokenCookieOptions");

const User = require("../models/user");


module.exports = {
  getNewRefreshToken: expressAsyncHandler(async (req, res) => {

    const refresh_token =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!refresh_token) {
      throw createError.Unauthorized();
    }

    const id = await verifyRefreshToken(refresh_token);

    if (!id) {
      throw createError.Unauthorized();
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      throw createError.Unauthorized();
    }

    // checking if userToken exist and refreshing it
    const userToken = await UserToken.findOneAndDelete({ token: refresh_token });
    if (!userToken) {
      throw createError.Unauthorized();
    }

    const { accessToken, refreshToken } = await generateToken(id);
    if (!accessToken || !refreshToken) {
      throw createError.InternalServerError();
    }


    res
      .status(200)
      .cookie("refreshToken", refreshToken, tokenCookieOptions)
      .cookie("accessToken", accessToken, tokenCookieOptions)
      .json({
        accessToken,
        refreshToken,
      });
  }),

  deleteRefreshToken: expressAsyncHandler(async (req, res) => {
    const refreshToken =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!refreshToken) {
      throw createError.Forbidden();
    }

    const userToken = await UserToken.findOne({ token: refreshToken });
    
    if (!userToken) {
      throw createError.InternalServerError();
    }

    await UserToken.deleteOne({ token: refreshToken });

    res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ message: "Logout successfully" });
  }),
};
