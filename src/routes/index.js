const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const router = express.Router();

const defaultRoutes = [
    { path: '/', route: authRoute },
    { path: '/', route: userRoute },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

router.get("/test", function (req, res) {
    return res.status(200).json({
        status: "success",
        message: "Test route"
    });
});

module.exports = router;