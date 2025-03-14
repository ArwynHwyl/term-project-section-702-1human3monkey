class backofficeCategoryModel {
  constructor(db) {
    this.db = db;
  }

  async getCategories() {
    const query = "SELECT * FROM Category";
    try {
      const [categories] = await this.db.execute(query);
      return categories;
    } catch (error) {
      console.error("Error getting categories: ", error);
      throw new Error("Error getting categories");
    }
  }

  async addCategory(name, imagePath) {
    const query = `INSERT INTO Category (category_name, image_path) VALUES (? ,?)`;
    try {
      const [result] = await this.db.execute(query, [name, imagePath]);
      return result;
    } catch (error) {
      console.error("Error adding category: ", error);
      throw new Error("Error adding category");
    }
  }
}

module.exports = backofficeCategoryModel;