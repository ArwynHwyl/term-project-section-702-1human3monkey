class backofficeProductModel {
  constructor (db) {
    this.db = db;
  }

  async getProducts() {
    const query = `
      SELECT p.product_id, p.product_name, p.description, p.image_path, p.normal_price, p.discount_percent, c.category_name
      FROM Product p
      JOIN Category c ON p.category_id = c.category_id
      ORDER BY p.product_name DESC
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
    const query = `INSERT INTO Product (product_name, description, category_id, normal_price, discount_percent, image_path) VALUES (?, ?, ?, ?, ?, ?)`;
    try {
      const [result] = await this.db.execute(query, [name, description, categoryId, normalPrice, discountPercent, imagePath]);
      return result.insertId;
    } catch (error) {
      console.error("Error adding product: ", error);
      throw new Error("Error adding product");
    }
  }

  async addProductAttribute(productId, attributes) {
    const query = `INSERT INTO ProductAttribute (product_id, color, size, quantity) VALUES ?`;
    const values = attributes.map((attribute) => [productId, attribute.color, attribute.size, attribute.quantity]);
    try {
      await this.db.query(query, [values]);
    } catch (error) {
      console.error("Error adding product attribute: ", error);
      throw new Error("Error adding product attribute");
    }
  }

  async getProductById(productId) {
    const query = `
      SELECT p.product_id, p.product_name, p.description, p.image_path, p.normal_price, p.discount_percent, c.category_name
      FROM Product p
      JOIN Category c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `;
    try {
      const [product] = await this.db.execute(query, [productId]);
      return product[0];
    } catch (error) {
      console.error("Error getting product by id: ", error);
      throw new Error("Error getting product by id");
    }
  }

  async deleteProductById(productId) {
    const query = `DELETE FROM Product WHERE product_id = ?`;
    try {
      await this.db.execute(query, [productId]);
    } catch (error) {
      console.error("Error deleting product: ", error);
      throw new Error("Error deleting product");
    }
  }
} 

module.exports = backofficeProductModel;