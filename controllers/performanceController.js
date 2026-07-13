// const Performance = require("../models/Performance");
// const Vendor = require("../models/Vendor");

// // ==========================================
// // Add Performance Review
// // ==========================================

// const addPerformance = async (req, res) => {
//   try {
//     const {
//       vendor,
//       deliveryRating,
//       qualityRating,
//       communicationRating,
//       costRating,
//       review,
//       evaluatedBy,
//     } = req.body;

//     // Check vendor exists
//     const vendorExists = await Vendor.findById(vendor);

//     if (!vendorExists) {
//       return res.status(404).json({
//         success: false,
//         message: "Vendor not found.",
//       });
//     }

//     const performance = await Performance.create({
//       vendor,
//       deliveryRating,
//       qualityRating,
//       communicationRating,
//       costRating,
//       review,
//       evaluatedBy,
//     });

//     // Update vendor average rating
//     vendorExists.rating = performance.overallRating;
//     await vendorExists.save();

//     res.status(201).json({
//       success: true,
//       message: "Performance added successfully.",
//       data: performance,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// // ==========================================
// // Get All Performance Reviews
// // ==========================================

// const getAllPerformance = async (req, res) => {

//   try {

//     const performances = await Performance.find()
//       .populate("vendor")
//       .sort({ createdAt: -1 });

//     res.status(200).json({

//       success: true,

//       count: performances.length,

//       data: performances,

//     });

//   } catch (error) {

//     res.status(500).json({

//       success: false,

//       message: error.message,

//     });

//   }

// };

// // ==========================================
// // Get Performance By Vendor ID
// // ==========================================

// const getVendorPerformance = async (req, res) => {

//   try {

//     const performances = await Performance.find({
//       vendor: req.params.vendorId,
//     }).populate("vendor");

//     res.status(200).json({

//       success: true,

//       count: performances.length,

//       data: performances,

//     });

//   } catch (error) {

//     res.status(500).json({

//       success: false,

//       message: error.message,

//     });

//   }

// };

// // ==========================================
// // Update Performance Review
// // ==========================================

// const updatePerformance = async (req, res) => {

//   try {

//     const performance =
//       await Performance.findByIdAndUpdate(

//         req.params.id,

//         req.body,

//         {
//           new: true,
//           runValidators: true,
//         }

//       );

//     if (!performance) {

//       return res.status(404).json({

//         success: false,

//         message: "Performance record not found.",

//       });

//     }

//     res.status(200).json({

//       success: true,

//       message: "Performance updated successfully.",

//       data: performance,

//     });

//   } catch (error) {

//     res.status(500).json({

//       success: false,

//       message: error.message,

//     });

//   }

// };
// // ==========================================
// // Delete Performance Review
// // ==========================================

// const deletePerformance = async (req, res) => {
//   try {
//     const performance = await Performance.findByIdAndDelete(req.params.id);

//     if (!performance) {
//       return res.status(404).json({
//         success: false,
//         message: "Performance record not found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Performance record deleted successfully.",
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// // ==========================================
// // Get Top Rated Vendors
// // ==========================================

// const getTopRatedVendors = async (req, res) => {
//   try {

//     const topVendors = await Vendor.find()
//       .sort({ rating: -1 })
//       .limit(5);

//     res.status(200).json({
//       success: true,
//       count: topVendors.length,
//       data: topVendors,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// // ==========================================
// // Performance Dashboard Statistics
// // ==========================================

// const performanceStats = async (req, res) => {
//   try {

//     const totalReviews = await Performance.countDocuments();

//     const averageRatings = await Performance.aggregate([
//       {
//         $group: {
//           _id: null,
//           avgDelivery: { $avg: "$deliveryRating" },
//           avgQuality: { $avg: "$qualityRating" },
//           avgCommunication: { $avg: "$communicationRating" },
//           avgCost: { $avg: "$costRating" },
//           avgOverall: { $avg: "$overallRating" },
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         totalReviews,
//         averageRatings:
//           averageRatings.length > 0
//             ? averageRatings[0]
//             : {
//                 avgDelivery: 0,
//                 avgQuality: 0,
//                 avgCommunication: 0,
//                 avgCost: 0,
//                 avgOverall: 0,
//               },
//       },
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// // ==========================================
// // Vendor Performance Dashboard
// // ==========================================

// const vendorPerformanceDashboard = async (req, res) => {
//   try {

//     const dashboard = await Performance.find()
//       .populate("vendor", "vendorName companyName rating")
//       .sort({ overallRating: -1 });

//     res.status(200).json({
//       success: true,
//       count: dashboard.length,
//       data: dashboard,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// // ==========================================
// // Export Controllers
// // ==========================================

// module.exports = {
//   addPerformance,
//   getAllPerformance,
//   getVendorPerformance,
//   updatePerformance,
//   deletePerformance,
//   getTopRatedVendors,
//   performanceStats,
//   vendorPerformanceDashboard,
// };


const Performance = require("../models/Performance");
const Vendor = require("../models/Vendor");

// =====================================================
// CREATE PERFORMANCE
// =====================================================

const addPerformance = async (req, res) => {

    try {

        const {

            vendor,

            quality,

            delivery,

            cost,

            communication,

            overall,

            comments

        } = req.body;

        // Required Validation

        if (

            !vendor ||

            quality === undefined ||

            delivery === undefined ||

            cost === undefined ||

            communication === undefined

        ) {

            return res.status(400).json({

                success: false,

                message: "Please fill all required fields."

            });

        }

        // Vendor Exists

        const vendorExists = await Vendor.findById(vendor);

        if (!vendorExists) {

            return res.status(404).json({

                success: false,

                message: "Vendor not found."

            });

        }

        const overallRating =

            overall ||

            (

                Number(quality) +

                Number(delivery) +

                Number(cost) +

                Number(communication)

            ) / 4;

        const performance = await Performance.create({

            vendor,

            quality,

            delivery,

            cost,

            communication,

            overall: overallRating,

            comments

        });

        vendorExists.rating = overallRating;

        await vendorExists.save();

        res.status(201).json({

            success: true,

            message: "Performance Evaluation Added Successfully.",

            data: performance

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

// =====================================================
// GET ALL PERFORMANCE
// =====================================================

const getAllPerformance = async (req, res) => {

    try {

        const performances =

            await Performance.find()

            .populate("vendor")

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            count: performances.length,

            data: performances

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================================
// GET PERFORMANCE BY ID
// =====================================================

const getPerformanceById = async (req, res) => {

    try {

        const performance =

            await Performance.findById(

                req.params.id

            ).populate("vendor");

        if (!performance) {

            return res.status(404).json({

                success: false,

                message: "Performance record not found."

            });

        }

        res.status(200).json({

            success: true,

            data: performance

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================================
// UPDATE PERFORMANCE
// =====================================================

const updatePerformance = async (req, res) => {

    try {

        const performance =
            await Performance.findById(req.params.id);

        if (!performance) {

            return res.status(404).json({

                success: false,

                message: "Performance record not found."

            });

        }

        const {

            vendor,

            quality,

            delivery,

            cost,

            communication,

            overall,

            comments

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

            performance.vendor = vendor;

        }

        performance.quality =
            quality ?? performance.quality;

        performance.delivery =
            delivery ?? performance.delivery;

        performance.cost =
            cost ?? performance.cost;

        performance.communication =
            communication ?? performance.communication;

        performance.comments =
            comments ?? performance.comments;

        performance.overall =

            overall ??

            (

                Number(performance.quality) +

                Number(performance.delivery) +

                Number(performance.cost) +

                Number(performance.communication)

            ) / 4;

        await performance.save();

        // Update Vendor Rating

        const vendorRecord =
            await Vendor.findById(performance.vendor);

        if (vendorRecord) {

            vendorRecord.rating =
                performance.overall;

            await vendorRecord.save();

        }

        res.status(200).json({

            success: true,

            message:
                "Performance Updated Successfully.",

            data: performance

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

// =====================================================
// DELETE PERFORMANCE
// =====================================================

const deletePerformance = async (req, res) => {

    try {

        const performance =
            await Performance.findByIdAndDelete(

                req.params.id

            );

        if (!performance) {

            return res.status(404).json({

                success: false,

                message:
                    "Performance record not found."

            });

        }

        res.status(200).json({

            success: true,

            message:
                "Performance Deleted Successfully."

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

// =====================================================
// PERFORMANCE STATISTICS
// =====================================================

const performanceStats = async (req, res) => {

    try {

        const totalEvaluations =
            await Performance.countDocuments();

        const average = await Performance.aggregate([

            {

                $group: {

                    _id: null,

                    avgQuality: {

                        $avg: "$quality"

                    },

                    avgDelivery: {

                        $avg: "$delivery"

                    },

                    avgCost: {

                        $avg: "$cost"

                    },

                    avgCommunication: {

                        $avg: "$communication"

                    },

                    avgOverall: {

                        $avg: "$overall"

                    }

                }

            }

        ]);

        res.status(200).json({

            success: true,

            data: {

                totalEvaluations,

                averageRatings:

                    average.length

                        ?

                        average[0]

                        :

                        {

                            avgQuality: 0,

                            avgDelivery: 0,

                            avgCost: 0,

                            avgCommunication: 0,

                            avgOverall: 0

                        }

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


// =====================================================
// TOP RATED VENDORS
// =====================================================

const getTopRatedVendors = async (req, res) => {

    try {

        const topVendors = await Vendor.find()

            .sort({

                rating: -1

            })

            .limit(5);

        res.status(200).json({

            success: true,

            count: topVendors.length,

            data: topVendors

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

// =====================================================
// PERFORMANCE DASHBOARD
// =====================================================

const vendorPerformanceDashboard = async (req, res) => {

    try {

        const dashboard =

            await Performance.find()

            .populate(

                "vendor",

                "vendorName companyName rating"

            )

            .sort({

                overall: -1,

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            count: dashboard.length,

            data: dashboard

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

// =====================================================
// GET PERFORMANCE BY VENDOR
// =====================================================

const getVendorPerformance = async (req, res) => {

    try {

        const records =

            await Performance.find({

                vendor: req.params.vendorId

            })

            .populate("vendor")

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            count: records.length,

            data: records

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

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {

    addPerformance,

    getAllPerformance,

    getPerformanceById,

    getVendorPerformance,

    updatePerformance,

    deletePerformance,

    getTopRatedVendors,

    performanceStats,

    vendorPerformanceDashboard

};




