const sanitize = require("mongo-sanitize");

module.exports = (body) => {
    try {
        return sanitize(body)
    } catch (error) {
        console.log("clean-body-error", error);
        return res.status(500).json({
            error: true,
            message: "Could not sanitize body",
        });
    }
};