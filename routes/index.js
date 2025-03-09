const express = require("express");
const backofficeCategoryRoute = require("./backofficeCategoryRoute");

const router = express.Router();

router.get("/backoffice", (req, res) => {
  res.redirect("/backoffice/category");
});

router.use(backofficeCategoryRoute);

module.exports = router;