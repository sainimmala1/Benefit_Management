const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registeruser

const registerUser = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).send({
            success: false,
            message: 'Please provide all required fields',
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`;
        const values = [email, hashedPassword, role];
        
        // Insert the user into the database
        await db.query(query, values);

        // Create JWT token
        const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send success response with token
        return res.status(201).send({
            success: true,
            message: 'User registered successfully',
            token,
        });

    } catch (error) {
        console.error('Error in registration:', error);
        return res.status(500).send({
            success: false,
            message: 'Error in registration',
            error: error.message || 'Database error',
        });
    }
};


// Login user
const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).send({
            success: false,
            message: 'Please provide all required fields',
        });
    }

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(401).send({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);

        if (!isMatch || user[0].role !== role) {
            return res.status(401).send({
                success: false,
                message: 'Invalid credentials or role mismatch',
            });
        }

        const token = jwt.sign({
            id: user[0].id,
            email: user[0].email,
            role: user[0].role
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).send({
            success: true,
            message: 'Login successful',
            token,
            role: user[0].role // Send the role back in the response
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error,
        });
    }
};


// Middleware to Protect Routes
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).send({
            success: false,
            message: 'No token provided, authorization denied',
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).send({
            success: false,
            message: 'Invalid token',
        });
    }
};


// Get all users (Admin only)
const getAllRegisters = async (req, res) => {
    try {
        const users = await db.query('SELECT id, email, role FROM users');

        res.status(200).send({
            success: true,
            message: 'List of all registered users',
            users: users[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in retrieving users',
            error: error.message
        });
    }
};
// User Controller File

const deleteRegister = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'User successfully deleted'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleting user',
            error: error.message
        });
    }
};

module.exports = { registerUser, loginUser, authenticateJWT, getAllRegisters, deleteRegister };






