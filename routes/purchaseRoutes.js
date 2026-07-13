// const express = require("express");

// const router = express.Router();

// const authMiddleware = require("../middleware/authMiddleware");

// const {
//   createPurchaseOrder,
//   getAllPurchaseOrders,
//   getPurchaseOrderById,
//   updatePurchaseOrder,
//   deletePurchaseOrder,
//   updateOrderStatus,
//   purchaseStats,
//   monthlyPurchaseReport,
// } = require("../controllers/purchaseController");

// // ======================================
// // Dashboard & Reports
// // ======================================

// // Purchase Dashboard Statistics
// router.get("/stats", authMiddleware, purchaseStats);

// // Monthly Purchase Report
// router.get("/report/monthly", authMiddleware, monthlyPurchaseReport);

// // ======================================
// // Purchase Order Status
// // ======================================

// // Update Purchase Order Status
// router.patch(
//   "/status/:id",
//   authMiddleware,
//   updateOrderStatus
// );

// // ======================================
// // CRUD Routes
// // ======================================

// // Get All Purchase Orders
// router.get("/", authMiddleware, getAllPurchaseOrders);

// // Get Purchase Order By ID
// router.get("/:id", authMiddleware, getPurchaseOrderById);

// // Create Purchase Order
// router.post("/", authMiddleware, createPurchaseOrder);

// // Update Purchase Order
// router.put("/:id", authMiddleware, updatePurchaseOrder);

// // Delete Purchase Order
// router.delete("/:id", authMiddleware, deletePurchaseOrder);

// module.exports = router;




const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    createPurchaseOrder,

    getAllPurchaseOrders,

    getPurchaseOrderById,

    updatePurchaseOrder,

    deletePurchaseOrder,

    updateOrderStatus,

    purchaseStats,

    monthlyPurchaseReport

} = require("../controllers/purchaseController");


// ======================================
// Dashboard
// ======================================

router.get(
    "/stats",
    authMiddleware,
    purchaseStats
);


// ======================================
// Reports
// ======================================

router.get(
    "/report/monthly",
    authMiddleware,
    monthlyPurchaseReport
);


// ======================================
// Status
// ======================================

router.patch(
    "/status/:id",
    authMiddleware,
    updateOrderStatus
);


// ======================================
// CRUD
// ======================================

router.get(
    "/",
    authMiddleware,
    getAllPurchaseOrders
);

router.get(
    "/:id",
    authMiddleware,
    getPurchaseOrderById
);

router.post(
    "/",
    authMiddleware,
    createPurchaseOrder
);

router.put(
    "/:id",
    authMiddleware,
    updatePurchaseOrder
);

router.delete(
    "/:id",
    authMiddleware,
    deletePurchaseOrder
);

module.exports = router;