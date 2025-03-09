class backofficeCategoryModel {
  constructor(db) {
    this.db = db;
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