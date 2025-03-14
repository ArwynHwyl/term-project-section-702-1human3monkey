const path = require("path");

function createBackofficeCategoryController(categoryModel) {
  async function getCategories(req, res) {
    try {
      const categories = await categoryModel.getCategories();
      res.render("pages/backoffice-category-page", {
        categories,
        activePage: "categories",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred while getting the categories" });
    }
  }

  async function addCategories(req, res) {
    const name = req.body.categoryName;
    const image = req.file;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    if (!image) {
      return res.status(400).json({ error: "Category image is required" });
    }

    const imagePath = path.join("/uploads", image.filename);

    try {
      await categoryModel.addCategory(name, imagePath);
      return res.status(201).json({ message: "Category added successfully", redirect: "/backoffice/category" }); 
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred while adding the category" });
    }
  }

  return {
    getCategories,
    addCategories,
  };
}

module.exports = createBackofficeCategoryController;