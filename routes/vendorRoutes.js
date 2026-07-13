const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  searchVendors,
  vendorStats,
} = require("../controllers/vendorController");



router.get("/stats", authMiddleware, vendorStats);



router.get("/search", authMiddleware, searchVendors);



// Get All Vendors
router.get("/", authMiddleware, getAllVendors);

// Get Vendor By ID
router.get("/:id", authMiddleware, getVendorById);

// Add Vendor
router.post("/", authMiddleware, createVendor);

// Update Vendor
router.put("/:id", authMiddleware, updateVendor);

// Delete Vendor
router.delete("/:id", authMiddleware, deleteVendor);

module.exports = router;