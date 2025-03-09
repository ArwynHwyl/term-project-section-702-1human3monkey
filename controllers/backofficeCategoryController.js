function createBackofficeCategoryController(categoryModel) {
  async function addCategories(req, res) {
    const name = req.body.categoryName;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    try {
      await categoryModel.addCategory(name);
      return res.status(201).json({ message: "Category added successfully", redirect: "/backoffice/category" }); 
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred while adding the category" });
    }
  }

  return {
    addCategories,
  };
}

module.exports = createBackofficeCategoryController;