const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const UserModel = require('./user_model');

const secretKey = process.env.SECRET_KEY;

async function registerUser(req, res) {
    const { name ,email, password, religion } = req.body;
    try {
    
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const newUser = new UserModel({ userId, name, email, password: hashedPassword, religion });
        
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
}

async function registerAdmin(req, res) {
    const { name ,email, password, religion } = req.body;
    try {
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const newUser = new UserModel({ userId, name, email, password: hashedPassword, religion, role: 'admin' });
        
        await newUser.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error registering Admin', error);
        res.status(500).json({ message: 'Failed to register Admin' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    console.log("login requested");

    try {
        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Generate JWT token

        const token = jwt.sign({ userId: user.userId }, secretKey, { expiresIn: '24h' });

        res.json({ token, message: 'Login success' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Couldn\'t login' });
    }
}

async function getAllUsers(req, res) {
    try {
        // Find users where the role is not 'admin'
        const users = await UserModel.find({ role: { $ne: 'admin' } });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Failed to get users' });
    }
}
async function myProfile(req, res) {
    res.status(200).json({ data: req.user
    });
}

function isStrongPassword(password) {
    // Check if password contains at least 1 special character
    const specialChars = /[\W_]/;
    return specialChars.test(password);
}

async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

 
    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await UserModel.findOne({userId: decoded.userId});
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

function protectedRoute(req, res) {
    res.json({ message: 'Protected route accessed', id: req.userId });
}

module.exports = {
    registerUser,
    login,
    authMiddleware,
    protectedRoute,
    myProfile,
    registerAdmin,
    getAllUsers
};