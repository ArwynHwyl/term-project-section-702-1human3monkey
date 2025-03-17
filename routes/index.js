const express = require('express');
const createAuthRoute = require('./auth');
const router = express.Router();
const UserModel = require('../models/userModel');
const AuthController = require('../controllers/authController');

function createRouter(db) {
    const userModel = new UserModel(db);
    const authController = new AuthController(userModel);

    router.get("/", authController.authentication, (req, res) => {
        res.render("index");
      });

    router.use("/auth", createAuthRoute(db));
    return router;
}

module.exports = createRouter;