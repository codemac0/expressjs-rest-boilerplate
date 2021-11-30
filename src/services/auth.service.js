const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const Token = require('../models/token.model');
const tokenService = require('./token.service');

const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }

    if (!user.active) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You must verify your email to activate your account');
    }
    return user;
};

const logout = async (accessToken) => {
    const accessTokennDoc = await Token.findOne({ token: accessToken, type: tokenTypes.ACCESS, blacklisted: false });
    if (!accessTokennDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await accessTokennDoc.remove();
};

module.exports = {
    loginUserWithEmailAndPassword,
    logout
};