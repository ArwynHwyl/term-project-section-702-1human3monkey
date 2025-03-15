const express = require("express");
const createBackofficeCategoryRoute = require("./backofficeCategoryRoute");
const createBackofficeProductRoute = require("./backofficeProductRoute");

function createRouter(db) {
  const router = express.Router();

  router.get("/backoffice", (req, res) => {
    res.redirect("/backoffice/category");
  });

  router.use(createBackofficeCategoryRoute(db));
  router.use(createBackofficeProductRoute(db));

  return router;
}

module.exports = createRouter;