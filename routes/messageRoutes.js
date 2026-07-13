const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    sendMessage,
    getAllMessages,
    getVendorMessages,
    getMessageById,
    markMessageAsRead,
    deleteMessage,
    messageStats,
    recentMessages
} = require("../controllers/messageController");


// Message Statistics
router.get(
    "/stats",
    authMiddleware,
    messageStats
);

// Recent Messages
router.get(
    "/recent",
    authMiddleware,
    recentMessages
);



// Get Messages By Vendor
router.get(
    "/vendor/:vendorId",
    authMiddleware,
    getVendorMessages
);



// Get All Messages
router.get(
    "/",
    authMiddleware,
    getAllMessages
);

// Get Message By ID
router.get(
    "/:id",
    authMiddleware,
    getMessageById
);

// Send Message
router.post(
    "/",
    authMiddleware,
    sendMessage
);

// Mark Message As Read
router.patch(
    "/read/:id",
    authMiddleware,
    markMessageAsRead
);

// Delete Message
router.delete(
    "/:id",
    authMiddleware,
    deleteMessage
);

module.exports = router;