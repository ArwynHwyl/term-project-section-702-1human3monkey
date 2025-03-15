class backofficeProductModel {
  constructor (db) {
    this.db = db;
  }

  async getProducts() {
    const query = `
      SELECT p.product_id, p.product_name, p.description, p.image_path, p.normal_price, p.promotion_percent, c.category_name
      FROM Product p
      JOIN Category c ON p.category_id = c.category_id
  `;
    try {
      const [products] = await this.db.execute(query);
      return products;
    } catch (error) {
      console.error("Error getting products: ", error);
      throw new Error("Error getting products");
    }
  }

  async addProduct(name, description, categoryId, normalPrice, discountPercent, imagePath) {
    const query = `INSERT INTO Product (product_name, description, category_id, normal_price, promotion_percent, image_path) VALUES (?, ?, ?, ?, ?, ?)`;
    try {
      const [result] = await this.db.execute(query, [name, description, categoryId, normalPrice, discountPercent, imagePath]);
      return result;
    } catch (error) {
      console.error("Error adding product: ", error);
      throw new Error("Error adding product");
    }
  }
} 

module.exports = backofficeProductModel;