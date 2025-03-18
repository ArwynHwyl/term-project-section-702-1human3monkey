const express = require("express");
const { getCategoryProducts, getAllCategories } = require("../controllers/categoryController");

const router = express.Router();

// Route to get all categories
router.get("/", getAllCategories);

// Route to get products by category
router.get("/:name", getCategoryProducts);

module.exports = router;