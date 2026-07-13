const mongoose = require("mongoose");

// In a serverless environment (e.g. Vercel) this module can be re-imported
// on every invocation, so we cache the connection promise to reuse the
// same connection instead of opening a new one each time.
let cachedConnection = null;

const connectDB = async () => {

    if (cachedConnection) {
        return cachedConnection;
    }

    try {

        cachedConnection = await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log("");

        console.log("===================================");

        console.log(" MongoDB Connected Successfully");

        console.log(` Host : ${cachedConnection.connection.host}`);

        console.log(` Database : ${cachedConnection.connection.name}`);

        console.log("===================================");

        return cachedConnection;

    }

    catch (error) {

        console.error("");

        console.error("===================================");

        console.error(" MongoDB Connection Failed");

        console.error(error.message);

        console.error("===================================");

        // Rethrow instead of calling process.exit(): in a serverless function
        // (e.g. Vercel) killing the process is unsafe, and for local runs
        // Node still exits on the resulting unhandled rejection anyway.
        throw error;

    }

};

module.exports = connectDB;