const userModel = require('../models/userModel');
const Token = require('../models/tokenModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('../middlewares/errorHandler');

/**
 * Generates access and refresh tokens for a user
 * @param {Object} user - User object from database
 * @returns {Object} Tokens and their expiry dates
 */
const generateTokens = async (user) => {
    // Generate short-lived access token (15 minutes)
    const accessToken = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '10s' }
    );

    // Generate long-lived refresh token (7 days)
    const refreshToken = jwt.sign(
        { _id: user._id, tokenType: 'refresh' },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    // Calculate token expiry dates
    const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Store refresh token in database for revocation capability
    await new Token({
        token: refreshToken,
        userId: user._id,
        type: 'refresh',
        blacklisted: false,
        expiresAt: refreshTokenExpiry
    }).save();

    return {
        accessToken,
        refreshToken,
        accessTokenExpiry,
        refreshTokenExpiry
    };
};

/**
 * Register a new user
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return next(new ErrorResponse('Name, Email and password are required', 400));
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return next(new ErrorResponse('User already exists', 400));
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new userModel({ 
            name, 
            email, 
            passwordHash: hashedPassword 
        });
        await newUser.save();

        res.status(201).json({ 
            message: 'User registered successfully' 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Authenticate user and generate tokens
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return next(new ErrorResponse('Email and password are required', 400));
        }

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateTokens(user);

        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,    // Prevent XSS attacks
            secure: true,      // HTTPS only (Render provides HTTPS)
            sameSite: 'none',   
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
            domain: process.env.DOMAIN_ENV
        });

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            accessToken,    // Send access token in response body
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Protected route example - returns user data
 */
const protected = async (req, res, next) => {
    try {
        const userData = await userModel.findById(req.user._id);

        if (!userData) {
            return next(new ErrorResponse('User not found', 404));
        }

        return res.status(200).json({
            success: true,
            user: {
                _id: userData._id,
                email: userData.email,
                name: userData.name
            },
            message: 'Access granted'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (req, res, next) => {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return next(new ErrorResponse('Refresh token not found', 401));
        }

        // Check if token exists and isn't blacklisted
        const tokenDoc = await Token.findOne({
            token: refreshToken,
            blacklisted: false
        });
        if (!tokenDoc) {
            return next(new ErrorResponse('Invalid or revoked refresh token', 401));
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Verify user still exists
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10s' }
        );

        res.status(200).json({
            success: true,
            accessToken
        });
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return next(new ErrorResponse('Invalid authentication token', 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new ErrorResponse('RefreshToken expired', 401));
        }
        next(error);
    }
};

/**
 * Logout user by revoking refresh token
 */
const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            // Blacklist the refresh token
            await Token.findOneAndUpdate(
                { token: refreshToken },
                { blacklisted: true }
            );
        }

        // Clear the refresh token cookie
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user data (with ownership validation)
 */
const getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return next(new ErrorResponse('User ID is required', 400));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Verify requesting user owns the data
        if (req.user._id.toString() !== userId) {
            return next(new ErrorResponse('Not authorized to access this user data', 403));
        }

        return res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            message: "User data retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refreshAccessToken,
    logout,
    protected,
    getCurrentUser
};