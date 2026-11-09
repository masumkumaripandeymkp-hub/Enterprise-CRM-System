const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/UserModel');

const {
    authenticateUser,
    authorizeRoles
} = require('../middleware/authMiddleware');


// ======================================
// 1. EMPLOYEE REGISTRATION API
// ======================================

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please fill all required fields.'
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long.'
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check existing user
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email is already registered.'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Employee account
        const newUser = new User({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'Employee'
        });

        // Save user in MongoDB
        await newUser.save();

        return res.status(201).json({
            message: 'Registration successful!',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);

        return res.status(500).json({
            message: 'Registration failed. Please try again.'
        });
    }
});


// ======================================
// 2. USER LOGIN API
// ======================================

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required.'
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Find user in MongoDB
        const user = await User.findOne({
            email: normalizedEmail
        });

        // Debugging information
        console.log('Login Email:', normalizedEmail);
        console.log('User Found:', !!user);

        if (!user) {
            console.log('Reason: User not found in database');

            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        // Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        console.log('Password Matched:', isPasswordCorrect);

        if (!isPasswordCorrect) {
            console.log('Reason: Password does not match');

            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        // Successful login response
        return res.status(200).json({
            message: 'Login successful!',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login Error:', error);

        return res.status(500).json({
            message: 'Login failed. Please try again.'
        });
    }
});


// ======================================
// 3. ADMIN ONLY TEST API
// ======================================

router.get(
    '/admin-test',
    authenticateUser,
    authorizeRoles('Admin'),
    (req, res) => {

        return res.status(200).json({
            message: 'Welcome Admin! You have full access.',
            role: req.user.role
        });

    }
);


module.exports = router;