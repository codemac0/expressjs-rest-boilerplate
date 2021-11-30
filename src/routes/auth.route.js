const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const auth = require('../middlewares/auth');
const validator = require('../middlewares/validator');
const authValidation = require('../validations/auth.validation');  

router.post("/signup", validator(authValidation.signup), AuthController.signup);
router.post("/signin", validator(authValidation.signin), AuthController.signin);
router.get("/signout", auth, validator(authValidation.signout), AuthController.signout);

module.exports = router;