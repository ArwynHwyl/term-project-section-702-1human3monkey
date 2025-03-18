const express = require("express");
const createBackofficeCategoryRoute = require("./backofficeCategoryRoute");
const createBackofficeProductRoute = require("./backofficeProductRoute");
const createHomepageRoute = require("./homepageRoute");

function createRouter(db) {
  const router = express.Router();

  router.get("/backoffice", (req, res) => {
    res.redirect("/backoffice/category");
  });

  router.use(createBackofficeCategoryRoute(db));
  router.use(createBackofficeProductRoute(db));
  router.use(createHomepageRoute(db));
  return router;
}

module.exports = createRouter;