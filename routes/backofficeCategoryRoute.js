const express = require("express");
const createBackofficeCategoryController = require("../controllers/backofficeCategoryController");
const backofficeCategoryModel = require("../models/backofficeCategoryModel");

function createBackofficeCategoryRoute(db) {
  const router = express.Router();
  const categoryModel = new backofficeCategoryModel(db);
  const categoryController = createBackofficeCategoryController(categoryModel);

  router.get("/backoffice/category", (req, res) => {
    const categories = [
      { name: "Shirt", stock: 300 },
      { name: "Pants", stock: 200 },
      { name: "Hood", stock: 500 },
      { name: "Dress", stock: 100 },
    ];
    res.render("pages/backoffice-category-page", {
      categories,
      activePage: "categories",
    });
  });

  router.get("/backoffice/category/add", (req, res) => {
    const categories = [
      { name: "Shirt", stock: 300 },
      { name: "Pants", stock: 200 },
      { name: "Hood", stock: 500 },
      { name: "Dress", stock: 100 },
      { name: "Shoes", stock: 50 },
      { name: "Sweater", stock: 300 },
    ];
    res.render("pages/backoffice-addcategory-page", {
      categories,
      activePage: "categories",
    });
  });

  router.post("/backoffice/category/add", categoryController.addCategories);

  return router;
}

module.exports = createBackofficeCategoryRoute;
