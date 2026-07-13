




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



router.get(
    "/stats",
    authMiddleware,
    purchaseStats
);



router.get(
    "/report/monthly",
    authMiddleware,
    monthlyPurchaseReport
);



router.patch(
    "/status/:id",
    authMiddleware,
    updateOrderStatus
);




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