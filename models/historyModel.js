class historyModel {
  constructor(db) {
    this.db = db;
  }

  async addHistoryItem(userId, product_id, product_attribute_id, quantity, addressId, creditCardId, orderDate) {
    const query = "INSERT INTO History (user_id, product_id, product_attribute_id, quantity, address_id, credit_card_id, order_date) VALUES (?, ?, ?, ?, ?, ?, ?)";

    try {
      const [result] = await this.db.execute(query, [userId, product_id, product_attribute_id, quantity, addressId, creditCardId, orderDate]);
      return result;
    }
    catch (error) {
      console.error("Error adding history item: ", error);
      throw new Error("Error adding history item");
    }
  }

  async getAllHistoryItems() {
    const query = "SELECT * FROM History";

    try {
      const [result] = await this.db.execute(query);
      return result;
    }
    catch (error) {
      console.error("Error getting all history items: ", error);
      throw new Error("Error getting all history items");
    }
  }

  async getHistoryRecords() {
    const query = `
      SELECT h.history_id, h.user_id, h.order_date,
             p.product_name, pa.color, pa.size, ci.quantity,
             p.normal_price, p.discount_percent
      FROM History h
      JOIN CartItem ci ON h.cart_item_id = ci.cart_item_id
      JOIN Product p ON ci.product_id = p.product_id
      JOIN ProductAttribute pa ON ci.product_attribute_id = pa.product_attribute_id
      ORDER BY h.order_date DESC
    `;
    const [historyRecords] = await this.db.query(query);
    return historyRecords;
  }
}

module.exports = historyModel;