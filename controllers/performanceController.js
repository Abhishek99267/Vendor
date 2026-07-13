const Performance = require("../models/Performance");
const Vendor = require("../models/Vendor");


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




