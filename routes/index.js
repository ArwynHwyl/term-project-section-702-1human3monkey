const express = require("express");
const createAuthRoute = require('./auth');
const createBackofficeCategoryRoute = require("./backofficeCategoryRoute");
const createBackofficeProductRoute = require("./backofficeProductRoute");
const UserModel = require('../models/userModel');
const AuthController = require('../controllers/authController');

function createRouter(db) {
  const router = express.Router();
  const userModel = new UserModel(db);
  const authController = new AuthController(userModel);

  router.get("/", authController.authentication, (req, res) => {
      res.render("index", { session: req.session });
  });

  router.get("/backoffice", (req, res) => {
    res.redirect("/backoffice/category");
  });
  
  router.use("/auth", createAuthRoute(db));
  router.use(createBackofficeCategoryRoute(db));
  router.use(createBackofficeProductRoute(db));

  return router;
}

module.exports = createRouter;