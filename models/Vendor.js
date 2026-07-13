const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: [true, "Vendor name is required"],
      trim: true,
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    gstNumber: {
      type: String,
      required: [true, "GST Number is required"],
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Raw Material",
        "Electronics",
        "IT Services",
        "Office Supplies",
        "Furniture",
        "Logistics",
        "Manufacturing",
        "Other"
      ],
      default: "Other",
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
        "Blocked"
      ],
      default: "Active",
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vendor", vendorSchema);