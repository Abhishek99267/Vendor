const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    sender: {
      type: String,
      required: [true, "Sender is required"],
      trim: true,
    },

    receiver: {
      type: String,
      required: [true, "Receiver is required"],
      trim: true,
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Message cannot be empty"],
      trim: true,
    },

    status: {
      type: String,
      enum: ["Unread", "Read"],
      default: "Unread",
    },

    attachment: {
      type: String,
      default: "",
    },

    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);