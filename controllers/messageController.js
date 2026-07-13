const Message = require("../models/Message");
const Vendor = require("../models/Vendor");

// ==========================================
// Send Message
// ==========================================

const sendMessage = async (req, res) => {
  try {
    const {
      vendor,
      sender,
      receiver,
      subject,
      message,
      attachment,
    } = req.body;

    // Check Vendor
    const vendorExists = await Vendor.findById(vendor);

    if (!vendorExists) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    const newMessage = await Message.create({
      vendor,
      sender,
      receiver,
      subject,
      message,
      attachment,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: newMessage,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Get All Messages
// ==========================================

const getAllMessages = async (req, res) => {

  try {

    const messages = await Message.find()
      .populate("vendor")
      .sort({ createdAt: -1 });

    res.status(200).json({

      success: true,

      count: messages.length,

      data: messages,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================================
// Get Messages By Vendor
// ==========================================

const getVendorMessages = async (req, res) => {

  try {

    const messages = await Message.find({
      vendor: req.params.vendorId,
    })
      .populate("vendor")
      .sort({ createdAt: -1 });

    res.status(200).json({

      success: true,

      count: messages.length,

      data: messages,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================================
// Get Message By ID
// ==========================================

const getMessageById = async (req, res) => {

  try {

    const message = await Message.findById(
      req.params.id
    ).populate("vendor");

    if (!message) {

      return res.status(404).json({

        success: false,

        message: "Message not found.",

      });

    }

    res.status(200).json({

      success: true,

      data: message,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
// ==========================================
// Mark Message as Read
// ==========================================

const markMessageAsRead = async (req, res) => {
  try {

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    message.status = "Read";

    await message.save();

    res.status(200).json({
      success: true,
      message: "Message marked as read.",
      data: message,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Delete Message
// ==========================================

const deleteMessage = async (req, res) => {

  try {

    const message = await Message.findByIdAndDelete(
      req.params.id
    );

    if (!message) {

      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });

    }

    res.status(200).json({

      success: true,

      message: "Message deleted successfully.",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================================
// Message Statistics
// ==========================================

const messageStats = async (req, res) => {

  try {

    const totalMessages =
      await Message.countDocuments();

    const unreadMessages =
      await Message.countDocuments({
        status: "Unread",
      });

    const readMessages =
      await Message.countDocuments({
        status: "Read",
      });

    res.status(200).json({

      success: true,

      data: {

        totalMessages,

        unreadMessages,

        readMessages,

      },

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================================
// Recent Messages
// ==========================================

const recentMessages = async (req, res) => {

  try {

    const messages = await Message.find()
      .populate("vendor")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({

      success: true,

      data: messages,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================================
// Export Controllers
// ==========================================

module.exports = {

  sendMessage,

  getAllMessages,

  getVendorMessages,

  getMessageById,

  markMessageAsRead,

  deleteMessage,

  messageStats,

  recentMessages,

};