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

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, JPG files are allowed."
      ),
      false
    );
    return
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

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

  router.post(
    "/backoffice/category/add",
    (req, res, next) => {
      upload.single("imageInput")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: err.message });
        } else if (err) {
          return res.status(400).json({ error: err.message });
        }
        next();
      });
    },
    categoryController.addCategories
  );

  router.get("/backoffice/category/edit/:id", categoryController.getCategoryById);

  router.post(
    "/backoffice/category/edit/:id",
    (req, res, next) => {
      upload.single("imageInput")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: err.message });
        } else if (err) {
          return res.status(400).json({ error: err.message });
        }
        next();
      });
    },
    categoryController.updateCategoryById
  );

  return router;
}

module.exports = createBackofficeCategoryRoute;
