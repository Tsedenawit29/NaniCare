// backend/controllers/authController.js
const { Pool } = require('pg');
const config = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // For creating tokens (optional for MVP, but common for login)
const pool = new Pool(config);
const User = require('../models/userModel'); // Ensure this path is correct

// Secret key for JWT (store in .env in a real app)
const JWT_SECRET = 'your-secret-key';

exports.register = async (req, res) => {
    const { name, phone, location, role, email, password } = req.body;

    if (!name || !role) {
        return res.status(400).json({ error: 'Name and role are required.' });
    }

    if (!phone && !email) {
        return res.status(400).json({ error: 'Phone number or email is required.' });
    }

    if (email && !password) {
        return res.status(400).json({ error: 'Password is required for email registration.' });
    }

    try {
        if (phone) {
            const existingUserByPhone = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
            if (existingUserByPhone.rows.length > 0) {
                return res.status(409).json({ error: 'Phone number already registered.' });
            }
        }

        if (email) {
            const existingUserByEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUserByEmail.rows.length > 0) {
                return res.status(409).json({ error: 'Email address already registered.' });
            }
        }

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const newUser = await User.create({ name, phone, location, role, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user: newUser });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

exports.login = async (req, res) => {
    const { identifier, password } = req.body; // Identifier can be email or phone

    if (!identifier || !password) {
        return res.status(400).json({ error: 'Email/Phone and password are required.' });
    }

    try {
        let user;
        console.log('Login attempt with identifier:', identifier);
        if (identifier.includes('@')) {
            user = await User.findByEmail(identifier);
            console.log('User found by email:', user);
        } else {
            user = await User.findByPhone(identifier);
            console.log('User found by phone:', user);
        }

        if (!user) {
            console.log('User not found for identifier:', identifier);
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        console.log('Comparing password:', password, 'with hashed:', user.password);
        const isPasswordValid = await User.comparePassword(password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // For MVP, you can just send back user info
        res.json({ message: 'Login successful', user });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};