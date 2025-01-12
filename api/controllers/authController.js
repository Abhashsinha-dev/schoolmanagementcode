const bcrypt = require('bcryptjs'); // For password hashing and comparison
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assuming the User model is already defined
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

// Login function to authenticate users and issue JWT tokens
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Compare the provided password with the stored hashed password
    //const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (password != user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Step 3: Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload with user ID and role
      process.env.JWT_SECRET, // Secret key from environment variable
      { expiresIn: '1h' } // Token expiry (1 hour)
    );

    // Step 4: Send the token back to the client
    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { loginUser };
