const express = require("express");
const xss = require('xss-clean');
const cors = require('cors');
const passport = require('passport');
const { errorConverter, errorHandler } = require('./middlewares/error');
const config = require('./config/config');
const { jwtStrategy } = require('./config/passport');
const routes = require('./routes');
const ApiError = require('./utils/ApiError');
const httpStatus = require('http-status');
  
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());

app.use(cors());
app.options('*', cors());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

if (config.env === 'production') {
  //app.use('/v1/auth', authLimiter);
} else {
  app.get("/ping", (req, res) => {
    return res.send({
      error: false,
      message: "Server is healthy",
    });
  });
}

app.use('/api', routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;