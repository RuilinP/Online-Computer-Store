const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes'); 
const computerRoutes = require('./routes/computerRoutes');

dotenv.config({ path: './config/config.env' });

const app = express();

// Middleware 
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running, welcome to the API' });
});


app.use('/api/users', userRoutes); 
app.use('/api/computers', computerRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Export the app instance
module.exports = app;