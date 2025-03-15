const express = require('express');
const createAuthRoute = require('./auth');
const router = express.Router();

function createRouter(db) {
    router.use("/auth", createAuthRoute(db));
    return router;
}

module.exports = createRouter;