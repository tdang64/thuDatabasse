const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.SECRET_KEY || 'my_secret_key';
// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password, // Password will be hashed before saving in schema pre-save hook
    });
    await newUser.save();

    // Respond with the user data (excluding password)
    res.status(201).json({ message: 'User registered successfully', user: { name, email } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if the password is valid
    const isPasswordValid = await user.isPasswordValid(password); // Compare hashed password
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token for the user
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    // Respond with token
    res.json({ message: 'User login successful', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





// Edit user profile
exports.editProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (email) user.email = email;
    console.log(password); // Debugging line to check if passwords matchole.log(password); // Debugging line to check if passwords matchpassword) user.password = await bcrypt.hash(password, 8); // Hash the new password

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  const userId = req.params.userId
  try {
    const user = await User.findById(userId); // Assuming you're using JWT auth
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete user profile
exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get list users
exports.getListUsers = async (req, res) => {
  try {
    const users = await User.find(); // Assuming you're using JWT auth


    res.json(
      users
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};