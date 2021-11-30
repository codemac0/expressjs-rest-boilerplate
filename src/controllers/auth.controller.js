const Joi = require("joi");
const httpStatus = require('http-status');
const User = require("../models/user.model");
const ApiError = require('../utils/ApiError');
const { authService, userService, tokenService } = require('../services');
const catchAsync = require('../utils/catchAsync')
const sanitize = require('../utils/sanitize')

require("dotenv").config();

exports.signup = catchAsync(async (req, res) => {
    req.body = sanitize(req.body);
    delete req.body.confirmPassword;
    const user = await userService.createUser(req.body);
    const token = await tokenService.generateAuthTokens(user);

    return res.status(200).json({
        success: true,
        message: "Registration Success",
        accessToken: token
    });
});

exports.signin = catchAsync(async (req, res) => {
    req.body = sanitize(req.body);
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    const token = await tokenService.generateAuthTokens(user);

    return res.send({
        success: true,
        message: "Signed in successfully",
        accessToken: token
    });
});

exports.signout = catchAsync(async (req, res) => {
    req.body = sanitize(req.body);
    await authService.logout(req.body.accessToken);
    res.status(httpStatus.NO_CONTENT).send({message: "Signed out."});
});
