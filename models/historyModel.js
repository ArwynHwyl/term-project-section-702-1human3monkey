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
}

module.exports = historyModel;