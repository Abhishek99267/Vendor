const mongoose = require("mongoose");

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

       
        throw error;

    }

};

module.exports = connectDB;