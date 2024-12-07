const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken');   // For authentication

// Description: Create a new user
// Route: POST /api/users
// access: Private
exports.createUser = async (req, res) => {
    try {
        const { name, phone, email, address, password, role } = req.body;
        const user = await User.create({ name, phone, email, address, password, role });
        const { hashedPassword, ...userWithoutPassword } = user.toJSON();
        res.status(201).json({ message: 'User created successfully', user: userWithoutPassword });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ message: 'Validation error', errors });
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'Duplicate entry', error: error.errors[0].message });
        } else {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }
};

// Description: Get all users
// Route: GET /api/users
// access: Privat
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['hashedPassword'] } });
        res.status(200).json({ message: 'Users retrieved successfully', users });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, { attributes: { exclude: ['hashedPassword'] } }); // locate user by ID, excluding the hashed password.
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User retrieved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

exports.getLoggedInUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findByPk(userId, { attributes: { exclude: ['hashedPassword'] } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User retrieved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

// Description: Update a user's details
// Route: PUT /api/users/:id
// access: Privat
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address, password, role } = req.body;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }

        // Update fields if provided
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.password = password || user.password; // This will trigger the `beforeUpdate` hook
        user.role = role || user.role;

        await user.save();
        const { hashedPassword, ...userWithoutPassword } = user.toJSON();
        res.status(200).json({ message: 'User updated successfully', user: userWithoutPassword });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ message: 'Validation error', errors });
        } else {
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params; //extract user id for the url
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }

        await user.destroy(); // paranoid: true
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
//login 
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};