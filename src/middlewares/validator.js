const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object);

    if (error) {
        const errorData = {};

        error.details.map((details) => {
            errorData[details.path[1]] = details.message;
        })

        return next(new ApiError(httpStatus.BAD_REQUEST, "Invalid data", errorData));
    }
    
    Object.assign(req, value);
    return next();
};

module.exports = validate;