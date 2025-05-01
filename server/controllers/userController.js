const userModel = require('../models/userModel');
const Token = require('../models/tokenModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('../middlewares/errorHandler');


const generateTokens = async (user) => {
    // Create access token (short-lived)
    const accessToken = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Short-lived as per requirements
    );

    // Create refresh token (long-lived)
    const refreshToken = jwt.sign(
        { _id: user._id, tokenType: 'refresh' },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } // Long-lived as per requirements
    );

    // Calculate expiry dates
    const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Save refresh token to database
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

const register = async (req, res, next) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new ErrorResponse('Name, Email and password are required', 400));
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return next(new ErrorResponse('User already exists', 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({ name, email, passwordHash: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorResponse('Email and password are required', 400));
        }


        const user = await userModel.findOne({ email });

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Generate both access and refresh tokens
        const { accessToken, refreshToken, refreshTokenExpiry } = await generateTokens(user);

        // Set refresh token as HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // Set to false for development on localhost
            sameSite: 'lax', // Important for cross-site cookie functionality
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            accessToken,
        });

    } catch (error) {
        next(error);
    }
};

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

const refreshAccessToken = async (req, res, next) => {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return next(new ErrorResponse('Refresh token not found', 401));
        }

        // Verify if token exists in database and not blacklisted
        const tokenDoc = await Token.findOne({
            token: refreshToken,
            blacklisted: false
        });

        if (!tokenDoc) {
            return next(new ErrorResponse('Invalid or revoked refresh token', 401));
        }

        // Verify token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Get user
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({
            success: true,
            accessToken
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new ErrorResponse('Invalid authentication token', 401));
        }

        if (error.name === 'TokenExpiredError') {
            return next(new ErrorResponse('RefreshToken expired', 401));
        }

        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            // Blacklist the refresh token
            await Token.findOneAndUpdate(
                { token: refreshToken },
                { blacklisted: true }
            );
        }

        // Clear the cookie
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};


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

        // Check if the requesting user has permission to view this user
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
}