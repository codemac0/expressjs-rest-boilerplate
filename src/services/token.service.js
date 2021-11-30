const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const ApiError = require('../utils/ApiError');
const { Token } = require('../models');
const userService = require('./user.service');

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
};

const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationDays, 'days');
    const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);
    await saveToken(accessToken, user.id, accessTokenExpires, tokenTypes.ACCESS);
  
    return {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
    };
};

const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
    if (!tokenDoc) {
      throw new Error('Token not found');
    }
    return tokenDoc;
};

module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens
  };