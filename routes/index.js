const express = require("express");
const createBackofficeCategoryRoute = require("./backofficeCategoryRoute");

function createRouter(db) {
  const router = express.Router();

  router.get("/backoffice", (req, res) => {
    res.redirect("/backoffice/category");
  });

  router.use(createBackofficeCategoryRoute(db));

  return router;
}

module.exports = createRouter;