const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes'); // Define routes
const computerRoutes = require('./routes/computerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sequelize = require('./config/db');
const cors = require('cors');

//Load env variales
dotenv.config({ path: './config/config.env' });

const app = express();

app.use(cors());
// Middleware 
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running, welcome to the API' });
});

// Mount routes
app.use('/api/users', userRoutes); // Mount user-related routes
app.use('/api/computers', computerRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);


// Central error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});
// Export the app instance
module.exports = app;