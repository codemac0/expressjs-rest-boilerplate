const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth');
const Controller = require("../controllers/user.controller");

router.get("/me", auth(), Controller.me);

module.exports = router;