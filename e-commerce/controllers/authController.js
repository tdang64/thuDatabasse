const User = require('../models/user');
const bcrypt = require('bcrypt'); // Import bcrypt (not bcryptjs)
const jwt = require('jsonwebtoken');

// JWT secret key (use a strong key in production)
const SECRET_KEY = 'my_secret_key'; 

// Register a new admin user (Only admin role allowed)
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(password);
    // Check if the admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create a new admin user (force role to be 'admin')
    const newAdmin = new User({
      username,
      email,
      password,
      role: 'admin', // Set the role to 'admin'
    });
    await newAdmin.save();

    // Respond with the admin data (excluding password)
    res.status(201).json({ message: 'Admin registered successfully', user: { username, email } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login admin user
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin by email and role
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    // Check if the password is valid
    const isPasswordValid = await admin.isPasswordValid(password); // Compare hashed password
    console.log('Password match:', isPasswordValid); 
    console.log(password);// Debugging line to check if passwords match
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token for the admin
    const token = jwt.sign({ id: admin._id, role: admin.role }, SECRET_KEY, { expiresIn: '1h' });

    // Respond with token
    res.json({ message: 'Admin login successful', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email and role
    const user = await User.findOne({ email, role: 'user' });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if the password is valid
    const isPasswordValid = await user.isPasswordValid(password); // Compare hashed password
    console.log('Password match:', isPasswordValid); 
    console.log(password);// Debugging line to check if passwords match
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token for the admin
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    // Respond with token
    res.json({ message: 'USer login successful', token, user: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all users profile
exports.getUsersProfile = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin get user profile by id
exports.getUserProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 }); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin update user profile by id
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { username, email }, { new: true, runValidators: true }); // Update and return the updated document
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Admin delete user profile by id
exports.deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};