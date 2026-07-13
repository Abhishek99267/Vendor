require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");

// Routes

const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();



connectDB();


app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Static Files

app.use(express.static(path.join(__dirname, "public")));



const pageRoutes = [
    { route: "/", file: "index.html" },
    { route: "/login", file: "login.html" },
    { route: "/register", file: "register.html" },
    { route: "/dashboard", file: "dashboard.html" },
    { route: "/vendors", file: "vendors.html" },
    { route: "/addVendor", file: "addVendor.html" },
    { route: "/purchaseOrders", file: "purchaseOrders.html" },
    { route: "/addPurchase", file: "addPurchase.html" },
    { route: "/performance", file: "performance.html" },
    { route: "/addPerformance", file: "addPerformance.html" },
    { route: "/messages", file: "messages.html" },
    { route: "/addMessage", file: "addMessage.html" },
];

pageRoutes.forEach(({ route, file }) => {

    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, "views", file));
    });

});



app.use("/api/auth", authRoutes);

app.use("/api/vendors", vendorRoutes);

app.use("/api/orders", purchaseRoutes);

app.use("/api/performance", performanceRoutes);

app.use("/api/messages", messageRoutes);



app.get("/api", (req, res) => {

    res.status(200).json({

        success: true,

        message: "VendorLink API is running."

    });

});



app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route Not Found"

    });

});



app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(err.status || 500).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

});



const PORT = process.env.PORT || 5000;


if (require.main === module) {

    app.listen(PORT, () => {

        console.log("");

        console.log("===================================");

        console.log(" VendorLink Server Started");

        console.log("===================================");

        console.log(` Server : http://localhost:${PORT}`);

        console.log("===================================");

    });

}

module.exports = app;