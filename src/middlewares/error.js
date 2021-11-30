const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, null, false, err.stack);
    }
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let { statusCode, message, errorData } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        error: true,
        code: statusCode,
        message,
        errorData: errorData,
        ...(config.env === 'development' && { stack: err.stack }),
    };

    if (config.env === 'development') {
        console.log(err);
    }

    res.status(statusCode).send(response);
};

module.exports = {
    errorConverter,
    errorHandler,
};