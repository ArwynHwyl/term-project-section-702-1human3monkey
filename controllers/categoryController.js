const session = require("express-session");
const db = require("../services/db");

async function getAllCategories(req, res) {
  try {
    const db = req.app.locals.db;
    const [categories] = await db.query(
      "SELECT category_id, category_name AS name, image_path AS icon FROM Category"
    );

    res.render("category", { categories, session: req.session });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Error fetching categories");
  }
}

async function getCategoryProducts(req, res) {
  const categoryName = req.params.name;
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const offset = (page - 1) * limit;

  const db = req.app.locals.db;

  try {
    const [products] = await db.query(
      `SELECT p.*, c.category_name 
       FROM Product p
       JOIN Category c ON p.category_id = c.category_id
       WHERE c.category_name = ?
       ORDER BY p.created_at DESC
      `,
      [categoryName]
    );

    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM Product p
       JOIN Category c ON p.category_id = c.category_id
       WHERE c.category_name = ?`,
      [categoryName]
    );

    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);

    res.render("pages/category/all-category-product", {
        categoryName,
        products,
        session: req.session,
      });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).send("Server Error");
  }
}

module.exports = { getAllCategories, getCategoryProducts };
