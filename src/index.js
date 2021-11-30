const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');

let server;

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    console.log("Database connection Success.");
    server = app.listen(config.port, () => {
        console.log("Server started listening on Port : " + config.port);
    });
})
.catch((err) => {
    console.error("Mongo Connection Error", err);
});;