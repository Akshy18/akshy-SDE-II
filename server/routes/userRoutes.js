const express = require('express');
const {register, getCurrentUser, login, protected, refreshAccessToken, logout} = require('../controllers/userController');
const authMiddleware = require("../middlewares/authMiddleware");
const userRoute = express.Router();

userRoute.post('/register',register);
userRoute.post('/login',login);
userRoute.post('/logout',logout);
userRoute.post('/refresh-token',refreshAccessToken);

userRoute.get('/getCurrentUser/:id',getCurrentUser);
userRoute.get('/protected',authMiddleware,protected);

module.exports = userRoute;
