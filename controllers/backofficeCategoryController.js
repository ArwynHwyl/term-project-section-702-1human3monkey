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
      return res
        .status(500)
        .json({ error: "An error occurred while getting the categories" });
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
      return res
        .status(201)
        .json({
          message: "Category added successfully",
          redirect: "/backoffice/category",
        });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while adding the category" });
    }
  }

  async function getCategoryById(req, res) {
    const id = req.params.id;
    try {
      const category = await categoryModel.getCategoryById(id);
      res.render("pages/backoffice-editcategory-page", {
        category,
        activePage: "categories",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while getting the category" });
    }
  }

  async function updateCategoryById(req, res) {
    const id = req.params.id;
    const name = req.body.categoryName;
    const image = req.file;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    try {
      const category = await categoryModel.getCategoryById(id);
      const imagePath = image ? path.join("/uploads", image.filename) : category.image_path;

      await categoryModel.updateCategoryById(id, name, imagePath);
      return res
        .status(200)
        .json({
          message: "Category updated successfully",
          redirect: "/backoffice/category",
        });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating the category" });
    }
  }

  async function deleteCategoryById(req, res) {
    const id = req.params.id;

    try {
      await categoryModel.deleteCategoryById(id);

      return res
        .status(200)
        .json({
          message: "Category deleted successfully",
          redirect: "/backoffice/category",
        });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the category" });
    }
  }

  return {
    getCategories,
    addCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
  };
}

module.exports = createBackofficeCategoryController;
