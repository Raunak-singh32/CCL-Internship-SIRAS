const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// ==========================================
// 1. REGISTER USER
// ==========================================
const register = asyncHandler(async (req, res) => {
  const { name, email, password, employeeId, designation, department, role, mineLocation, contactNumber } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    employeeId,
    designation,
    department,
    role,
    mineLocation,
    contactNumber
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token: generateToken(user._id),
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// ==========================================
// 2. LOGIN USER
// ==========================================
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check email & password provided
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user (explicitly select password since it's hidden by default)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: generateToken(user._id),
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mineLocation: user.mineLocation,
      department: user.department
    }
  });
});

// ==========================================
// 3. GET CURRENT USER (Me)
// ==========================================
const getMe = asyncHandler(async (req, res) => {
  // req.user will be set by auth middleware (coming in Step 12)
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

module.exports = {
  register,
  login,
  getMe
};