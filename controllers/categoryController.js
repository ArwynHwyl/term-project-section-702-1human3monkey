async function getAllCategories(req, res) {
    try {
      const db = req.app.locals.db;
      const [categories] = await db.query("SELECT category_id, category_name AS name, image_path AS icon FROM Category"
      );
  
      res.render("category", { categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).send("Error fetching categories");
    }
  }
  
  module.exports = { getAllCategories };
  