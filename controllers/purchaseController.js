// const PurchaseOrder = require("../models/PurchaseOrder");
// const Vendor = require("../models/Vendor");

// // =========================================
// // Create Purchase Order
// // =========================================
// const createPurchaseOrder = async (req, res) => {
//   try {
//     const {
//       vendor,
//       purchaseOrderNo,
//       productName,
//       description,
//       quantity,
//       unitPrice,
//       expectedDeliveryDate,
//       paymentStatus,
//       remarks,
//     } = req.body;

//     // Check Vendor
//     const vendorExists = await Vendor.findById(vendor);

//     if (!vendorExists) {
//       return res.status(404).json({
//         success: false,
//         message: "Vendor not found.",
//       });
//     }

//     // Check Duplicate PO Number
//     const existingPO = await PurchaseOrder.findOne({
//       purchaseOrderNo,
//     });

//     if (existingPO) {
//       return res.status(400).json({
//         success: false,
//         message: "Purchase Order Number already exists.",
//       });
//     }

//     const totalAmount = quantity * unitPrice;

//     const purchaseOrder = await PurchaseOrder.create({
//       vendor,
//       purchaseOrderNo,
//       productName,
//       description,
//       quantity,
//       unitPrice,
//       totalAmount,
//       expectedDeliveryDate,
//       paymentStatus,
//       remarks,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Purchase Order Created Successfully.",
//       data: purchaseOrder,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// // =========================================
// // Get All Purchase Orders
// // =========================================

// const getAllPurchaseOrders = async (req, res) => {

//   try {

//     const purchaseOrders = await PurchaseOrder.find()
//       .populate("vendor")
//       .sort({ createdAt: -1 });

//     res.status(200).json({

//       success: true,

//       count: purchaseOrders.length,

//       data: purchaseOrders,

//     });

//   } catch (error) {

//     res.status(500).json({

//       success: false,

//       message: error.message,

//     });

//   }

// };

// // =========================================
// // Get Purchase Order By ID
// // =========================================

// const getPurchaseOrderById = async (req, res) => {

//   try {

//     const purchaseOrder = await PurchaseOrder.findById(
//       req.params.id
//     ).populate("vendor");

//     if (!purchaseOrder) {

//       return res.status(404).json({

//         success: false,

//         message: "Purchase Order not found.",

//       });

//     }

//     res.status(200).json({

//       success: true,

//       data: purchaseOrder,

//     });

//   } catch (error) {

//     res.status(500).json({

//       success: false,

//       message: error.message,

//     });

//   }

// };

// // =========================================
// // Update Purchase Order
// // =========================================

// const updatePurchaseOrder = async (req, res) => {

//   try {

//     if (req.body.quantity && req.body.unitPrice) {

//       req.body.totalAmount =
//         req.body.quantity * req.body.unitPrice;

//     }

//     const purchaseOrder =
//       await PurchaseOrder.findByIdAndUpdate(

//         req.params.id,

//         req.body,

//         {
//           new: true,
//           runValidators: true,
//         }

//       ).populate("vendor");

//     if (!purchaseOrder) {

//       return res.status(404).json({

//         success: false,

//         message: "Purchase Order not found.",

//       });

//     }

//     res.status(200).json({

//       success: true,

//       message: "Purchase Order Updated Successfully.",

//       data: purchaseOrder,

//     });

//   } catch (error) {

//     res.status(500).json({

//       success: false,

//       message: error.message,

//     });

//   }

// };

// // =========================================
// // Delete Purchase Order
// // =========================================

// const deletePurchaseOrder = async (req, res) => {
//   try {

//     const purchaseOrder = await PurchaseOrder.findByIdAndDelete(
//       req.params.id
//     );

//     if (!purchaseOrder) {
//       return res.status(404).json({
//         success: false,
//         message: "Purchase Order not found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Purchase Order deleted successfully.",
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// // =========================================
// // Change Purchase Order Status
// // =========================================

// const updateOrderStatus = async (req, res) => {

//   try {

//     const { status } = req.body;

//     const purchaseOrder =
//       await PurchaseOrder.findById(req.params.id);

//     if (!purchaseOrder) {

//       return res.status(404).json({
//         success: false,
//         message: "Purchase Order not found.",
//       });

//     }

//     purchaseOrder.status = status;

//     if (status === "Delivered") {
//       purchaseOrder.deliveryDate = new Date();
//     }

//     await purchaseOrder.save();

//     res.status(200).json({
//       success: true,
//       message: "Order status updated successfully.",
//       data: purchaseOrder,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };

// // =========================================
// // Purchase Dashboard Statistics
// // =========================================

// const purchaseStats = async (req, res) => {

//   try {

//     const totalOrders =
//       await PurchaseOrder.countDocuments();

//     const pendingOrders =
//       await PurchaseOrder.countDocuments({
//         status: "Pending",
//       });

//     const processingOrders =
//       await PurchaseOrder.countDocuments({
//         status: "Processing",
//       });

//     const deliveredOrders =
//       await PurchaseOrder.countDocuments({
//         status: "Delivered",
//       });

//     const cancelledOrders =
//       await PurchaseOrder.countDocuments({
//         status: "Cancelled",
//       });

//     const totalPurchase = await PurchaseOrder.aggregate([
//       {
//         $group: {
//           _id: null,
//           total: {
//             $sum: "$totalAmount",
//           },
//         },
//       },
//     ]);

//     res.status(200).json({

//       success: true,

//       data: {

//         totalOrders,

//         pendingOrders,

//         processingOrders,

//         deliveredOrders,

//         cancelledOrders,

//         totalPurchase:
//           totalPurchase.length > 0
//             ? totalPurchase[0].total
//             : 0,

//       },

//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };

// // =========================================
// // Monthly Purchase Report
// // =========================================

// const monthlyPurchaseReport = async (req, res) => {

//   try {

//     const report = await PurchaseOrder.aggregate([
//       {
//         $group: {
//           _id: {
//             month: {
//               $month: "$createdAt",
//             },
//             year: {
//               $year: "$createdAt",
//             },
//           },

//           totalOrders: {
//             $sum: 1,
//           },

//           totalPurchase: {
//             $sum: "$totalAmount",
//           },
//         },
//       },

//       {
//         $sort: {
//           "_id.year": 1,
//           "_id.month": 1,
//         },
//       },
//     ]);

//     res.status(200).json({

//       success: true,

//       data: report,

//     });

//   } catch (error) {

//     res.status(500).json({

//       success: false,

//       message: error.message,

//     });

//   }

// };

// // =========================================
// // Export Controllers
// // =========================================

// module.exports = {

//   createPurchaseOrder,

//   getAllPurchaseOrders,

//   getPurchaseOrderById,

//   updatePurchaseOrder,

//   deletePurchaseOrder,

//   updateOrderStatus,

//   purchaseStats,

//   monthlyPurchaseReport,

// };


















const PurchaseOrder = require("../models/PurchaseOrder");
const Vendor = require("../models/Vendor");

// ======================================================
// CREATE PURCHASE ORDER
// ======================================================

const createPurchaseOrder = async (req, res) => {
  console.log(req.body);

    try {

        const {

            vendor,

            purchaseOrderNo,

            productName,

            description,

            quantity,

            unitPrice,

            expectedDeliveryDate,

            status,

            paymentStatus,

            remarks

        } = req.body;

        // ----------------------------
        // Required Validation
        // ----------------------------

        if (
            !vendor ||
            !purchaseOrderNo ||
            !productName ||
            !quantity ||
            !unitPrice ||
            !expectedDeliveryDate
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill all required fields."

            });

        }

        // ----------------------------
        // Vendor Exists
        // ----------------------------

        const vendorExists =
            await Vendor.findById(vendor);

        if (!vendorExists) {

            return res.status(404).json({

                success: false,

                message: "Vendor not found."

            });

        }

        // ----------------------------
        // Duplicate PO
        // ----------------------------

        const existingPO =
            await PurchaseOrder.findOne({

                purchaseOrderNo

            });

        if (existingPO) {

            return res.status(400).json({

                success: false,

                message:
                    "Purchase Order Number already exists."

            });

        }

        // ----------------------------
        // Calculate Total
        // ----------------------------

        const totalAmount =

            Number(quantity) *

            Number(unitPrice);

        // ----------------------------
        // Save
        // ----------------------------

        const purchaseOrder =

            await PurchaseOrder.create({

                vendor,

                purchaseOrderNo,

                productName,

                description,

                quantity,

                unitPrice,

                totalAmount,

                expectedDeliveryDate,

                status:

                    status || "Pending",

                paymentStatus:

                    paymentStatus || "Pending",

                remarks

            });

        res.status(201).json({

            success: true,

            message:
                "Purchase Order Created Successfully.",

            data: purchaseOrder

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// GET ALL PURCHASE ORDERS
// ======================================================

const getAllPurchaseOrders = async (req, res) => {

    try {

        const purchaseOrders =

            await PurchaseOrder.find()

            .populate("vendor")

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            count: purchaseOrders.length,

            data: purchaseOrders

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// GET SINGLE PURCHASE ORDER
// ======================================================

const getPurchaseOrderById = async (req, res) => {

    try {

        const purchaseOrder =

            await PurchaseOrder.findById(

                req.params.id

            )

            .populate("vendor");

        if (!purchaseOrder) {

            return res.status(404).json({

                success: false,

                message:
                    "Purchase Order not found."

            });

        }

        res.status(200).json({

            success: true,

            data: purchaseOrder

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// UPDATE PURCHASE ORDER
// ======================================================

const updatePurchaseOrder = async (req, res) => {

    try {

        const purchaseOrder =
            await PurchaseOrder.findById(req.params.id);

        if (!purchaseOrder) {

            return res.status(404).json({

                success: false,

                message: "Purchase Order not found."

            });

        }

        const {

            vendor,

            purchaseOrderNo,

            productName,

            description,

            quantity,

            unitPrice,

            expectedDeliveryDate,

            status,

            paymentStatus,

            remarks

        } = req.body;

        // Vendor Validation

        if (vendor) {

            const vendorExists =
                await Vendor.findById(vendor);

            if (!vendorExists) {

                return res.status(404).json({

                    success: false,

                    message: "Vendor not found."

                });

            }

        }

        // Duplicate PO Check

        if (

            purchaseOrderNo &&

            purchaseOrderNo !== purchaseOrder.purchaseOrderNo

        ) {

            const duplicate =
                await PurchaseOrder.findOne({

                    purchaseOrderNo

                });

            if (duplicate) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Purchase Order Number already exists."

                });

            }

        }

        purchaseOrder.vendor =
            vendor ?? purchaseOrder.vendor;

        purchaseOrder.purchaseOrderNo =
            purchaseOrderNo ??
            purchaseOrder.purchaseOrderNo;

        purchaseOrder.productName =
            productName ??
            purchaseOrder.productName;

        purchaseOrder.description =
            description ??
            purchaseOrder.description;

        purchaseOrder.quantity =
            quantity ??
            purchaseOrder.quantity;

        purchaseOrder.unitPrice =
            unitPrice ??
            purchaseOrder.unitPrice;

        purchaseOrder.expectedDeliveryDate =
            expectedDeliveryDate ??
            purchaseOrder.expectedDeliveryDate;

        purchaseOrder.status =
            status ??
            purchaseOrder.status;

        purchaseOrder.paymentStatus =
            paymentStatus ??
            purchaseOrder.paymentStatus;

        purchaseOrder.remarks =
            remarks ??
            purchaseOrder.remarks;

        purchaseOrder.totalAmount =

            Number(purchaseOrder.quantity) *

            Number(purchaseOrder.unitPrice);

        await purchaseOrder.save();

        res.status(200).json({

            success: true,

            message:
                "Purchase Order Updated Successfully.",

            data: purchaseOrder

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// DELETE PURCHASE ORDER
// ======================================================

const deletePurchaseOrder = async (req, res) => {

    try {

        const purchaseOrder =
            await PurchaseOrder.findByIdAndDelete(

                req.params.id

            );

        if (!purchaseOrder) {

            return res.status(404).json({

                success: false,

                message:
                    "Purchase Order not found."

            });

        }

        res.status(200).json({

            success: true,

            message:
                "Purchase Order Deleted Successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// UPDATE ORDER STATUS
// ======================================================

const updateOrderStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const purchaseOrder =
            await PurchaseOrder.findById(

                req.params.id

            );

        if (!purchaseOrder) {

            return res.status(404).json({

                success: false,

                message:
                    "Purchase Order not found."

            });

        }

        purchaseOrder.status = status;

        if (status === "Delivered") {

            purchaseOrder.deliveryDate =
                new Date();

        }

        await purchaseOrder.save();

        res.status(200).json({

            success: true,

            message:
                "Order Status Updated Successfully.",

            data: purchaseOrder

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// PURCHASE DASHBOARD STATS
// ======================================================

const purchaseStats = async (req, res) => {

    try {

        const totalOrders =
            await PurchaseOrder.countDocuments();

        const pendingOrders =
            await PurchaseOrder.countDocuments({

                status: "Pending"

            });

        const processingOrders =
            await PurchaseOrder.countDocuments({

                status: "Processing"

            });

        const deliveredOrders =
            await PurchaseOrder.countDocuments({

                status: "Delivered"

            });

        const cancelledOrders =
            await PurchaseOrder.countDocuments({

                status: "Cancelled"

            });

        const totalPurchase =
            await PurchaseOrder.aggregate([

                {

                    $group: {

                        _id: null,

                        total: {

                            $sum: "$totalAmount"

                        }

                    }

                }

            ]);

        res.status(200).json({

            success: true,

            data: {

                totalOrders,

                pendingOrders,

                processingOrders,

                deliveredOrders,

                cancelledOrders,

                totalPurchase:

                    totalPurchase.length

                        ?

                        totalPurchase[0].total

                        :

                        0

            }

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// MONTHLY PURCHASE REPORT
// ======================================================

const monthlyPurchaseReport = async (req, res) => {

    try {

        const report = await PurchaseOrder.aggregate([

            {

                $group: {

                    _id: {

                        year: {

                            $year: "$createdAt"

                        },

                        month: {

                            $month: "$createdAt"

                        }

                    },

                    totalOrders: {

                        $sum: 1

                    },

                    totalPurchase: {

                        $sum: "$totalAmount"

                    }

                }

            },

            {

                $sort: {

                    "_id.year": 1,

                    "_id.month": 1

                }

            }

        ]);

        res.status(200).json({

            success: true,

            data: report

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {

    createPurchaseOrder,

    getAllPurchaseOrders,

    getPurchaseOrderById,

    updatePurchaseOrder,

    deletePurchaseOrder,

    updateOrderStatus,

    purchaseStats,

    monthlyPurchaseReport

};