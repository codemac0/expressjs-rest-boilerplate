const Joi = require('joi');
const { password } = require('./custom.validation');

const signup = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email({ minDomainSegments: 2 }),
        password: Joi.string().required().custom(password),
        confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    }),
};
  
const signin = {
    body: Joi.object().keys({
        email: Joi.string().required().email({ minDomainSegments: 2 }),
        password: Joi.string().required().min(4)
    }),
};
  
const signout = {
    body: Joi.object().keys({
      accessToken: Joi.string().required(),
    }),
};

module.exports = {
    signup,
    signin,
    signout
};