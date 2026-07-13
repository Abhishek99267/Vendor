const Vendor = require("../models/Vendor");


const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);

    res.status(201).json({
      success: true,
      message: "Vendor added successfully.",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully.",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const searchVendors = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const vendors = await Vendor.find({
      $or: [
        {
          vendorName: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          companyName: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          email: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          category: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const vendorStats = async (req, res) => {
  try {
    const totalVendors = await Vendor.countDocuments();

    const activeVendors = await Vendor.countDocuments({
      status: "Active",
    });

    const inactiveVendors = await Vendor.countDocuments({
      status: "Inactive",
    });

    const blockedVendors = await Vendor.countDocuments({
      status: "Blocked",
    });

    const averageRating = await Vendor.aggregate([
      {
        $group: {
          _id: null,
          average: {
            $avg: "$rating",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalVendors,
        activeVendors,
        inactiveVendors,
        blockedVendors,
        averageRating:
          averageRating.length > 0
            ? averageRating[0].average.toFixed(2)
            : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  searchVendors,
  vendorStats,
};