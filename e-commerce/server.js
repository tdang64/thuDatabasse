const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/authRoutes'); // Ensure this path is correct
const authRoutes = require('./routes/authRoutes'); // Ensure this path is correct

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://group2:termProject@clusterproject.1ysq8.mongodb.net/test?retryWrites=true&w=majority&appName=ClusterProject', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Root Route
app.get('/', (req, res) => res.send('Welcome to the e-commerce of group 2'));

// API Routes
app.use('/api/users', userRoutes);   // User-related routes (CRUD for users)
app.use('/api/products', productRoutes);  // Product-related routes (CRUD for products)
app.use('/api/admin', adminRoutes);  // Admin login and registration routes
app.use('/auth', authRoutes)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
