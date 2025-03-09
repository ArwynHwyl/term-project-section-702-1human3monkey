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

  async addCategory(name) {
    const query = `INSERT INTO Category (category_name) VALUES ('${name}')`;
    try {
      const [result] = await this.db.execute(query);
      return result;
    } catch (error) {
      console.error("Error adding category: ", error);
      throw new Error("Error adding category");
    }
  }
}

module.exports = backofficeCategoryModel;