require('dotenv').config();
const mongoose = require("mongoose");
const {MONGO_URI} = process.env;

// IIFE to give access to async/await
(async () => {
// Configure MongoDB and Mongoose
    try {
        await mongoose
            .connect(MONGO_URI, {})
            .then(async () => {
                console.log("MongoDB >> Connected!");

            });
    } catch (error) {
        console.log(`MongoDB ERROR >> ${error.message}`);

        // Exit current process with failure
        process.exit(1);
    }
})();