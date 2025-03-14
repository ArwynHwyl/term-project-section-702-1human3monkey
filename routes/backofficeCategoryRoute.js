const express = require("express");
const createBackofficeCategoryController = require("../controllers/backofficeCategoryController");
const backofficeCategoryModel = require("../models/backofficeCategoryModel");
const multer = require("multer");
const path = require("path");

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage: storage });

function createBackofficeCategoryRoute(db) {
  const router = express.Router();
  const categoryModel = new backofficeCategoryModel(db);
  const categoryController = createBackofficeCategoryController(categoryModel);

  router.get("/backoffice/category", categoryController.getCategories);

  router.get("/backoffice/category/add", (req, res) => {
    res.render("pages/backoffice-addcategory-page", {
      activePage: "categories",
    });
  });

  router.post("/backoffice/category/add", upload.single("imageInput"), categoryController.addCategories);

  return router;
}

module.exports = createBackofficeCategoryRoute;
