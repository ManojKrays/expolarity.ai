const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            directConnection: true, // Required for AWS DocumentDB
            tlsCAFile: "D:/zurtle/global-bundle.pem",         }); // No need for options
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDB;