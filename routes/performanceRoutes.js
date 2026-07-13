const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addPerformance,
    getAllPerformance,
    getVendorPerformance,
    updatePerformance,
    deletePerformance,
    getTopRatedVendors,
    performanceStats,
    vendorPerformanceDashboard
} = require("../controllers/performanceController");


// Top Rated Vendors
router.get(
    "/top-rated",
    authMiddleware,
    getTopRatedVendors
);

// Dashboard Statistics
router.get(
    "/stats",
    authMiddleware,
    performanceStats
);

// Performance Dashboard
router.get(
    "/dashboard",
    authMiddleware,
    vendorPerformanceDashboard
);



// Get Performance By Vendor
router.get(
    "/vendor/:vendorId",
    authMiddleware,
    getVendorPerformance
);



// Get All Reviews
router.get(
    "/",
    authMiddleware,
    getAllPerformance
);

// Add Review
router.post(
    "/",
    authMiddleware,
    addPerformance
);

// Update Review
router.put(
    "/:id",
    authMiddleware,
    updatePerformance
);

// Delete Review
router.delete(
    "/:id",
    authMiddleware,
    deletePerformance
);

module.exports = router;