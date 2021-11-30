const Joi = require("joi");
const httpStatus = require('http-status');
const User = require("../models/user.model");
const ApiError = require('../utils/ApiError');
const { authService, userService, tokenService } = require('../services');
const catchAsync = require('../utils/catchAsync')
require("dotenv").config();

exports.me = catchAsync(async (req, res) => {
    return res.status(200).json({
        success: true,
        data: req.user
    });
});