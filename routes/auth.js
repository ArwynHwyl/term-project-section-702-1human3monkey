const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const UserModel = require('../models/userModel');

// router.post('/login', authController.login);

// router.post('/register', authController.register);

function createAuthRoute(db) {
    const userModel = new UserModel(db);
    const authController = new AuthController(userModel);

    router.get('/login', (req, res) => {
        res.render('pages/authen/login', { pageTitle: 'Sign in to your account' });
    });
    
    router.get('/register', (req, res) => {
        res.render('pages/authen/register', { pageTitle: 'Create an account' });
    });

    router.post('/login', authController.login);

    router.post('/register', authController.register);

    return router;
}

module.exports = createAuthRoute;