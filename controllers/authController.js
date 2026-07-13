const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      company,
      role
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists."
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      company,
      role
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and Password are required."
      });

    }

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password"
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password"
      });

    }

    // Generate JWT

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({

      success: true,

      message: "Login Successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

const getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found."
      });

    }

    res.status(200).json({

      success: true,

      data: user

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



module.exports = {

  registerUser,

  loginUser,

  getProfile

};