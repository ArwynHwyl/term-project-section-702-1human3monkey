class cartModel {
  constructor(db, historyModel) {
    this.db = db;
    this.historyModel = historyModel;
  }

  async addCartItems(cartId, productId, productAttributeId, quantity) {
    const query = "INSERT INTO CartItem (cart_id, product_id, product_attribute_id, quantity) VALUES (?, ?, ?, ?)";

    try {
      const [result] = await this.db.execute(query, [cartId, productId, productAttributeId, quantity]);
      return result;
    } catch (error) {
      console.error("Error adding cart item: ", error);
      throw new Error("Error adding cart item");
    }
  }

  async updateCartItemQuantity(cartItemId, quantity) {
    const query = "UPDATE CartItem SET quantity = ? WHERE cart_item_id = ?";

    try {
      const [result] = await this.db.execute(query, [quantity, cartItemId]);
      return result;
    } catch (error) {
      console.error("Error updating cart item quantity: ", error);
      throw new Error("Error updating cart item quantity");
    }
  }

  async deleteCartItem(cartItemId) {
    const query = "DELETE FROM CartItem WHERE cart_item_id = ?";

    try {
      const [result] = await this.db.execute(query, [cartItemId]);
      return result;
    } catch (error) {
      console.error("Error deleting cart item: ", error);
      throw new Error("Error deleting cart item");
    }
  }

  async clearCart(cartId) {
    const query = "DELETE FROM CartItem WHERE cart_id = ?";

    try {
      const [result] = await this.db.execute(query, [cartId]);
      return result;
    } catch (error) {
      console.error("Error clearing cart: ", error);
      throw new Error("Error clearing cart");
    }
  }

  async addCartItemsToHistory(cartId, userId, addressId, creditCardId, orderDate) {
    const getCartItemsQuery = "SELECT * FROM CartItem WHERE cart_id = ?";

    try {
      const [cartItems] = await this.db.execute(getCartItemsQuery, [cartId]);

      for (const cartItem of cartItems) {
        await this.historyModel.addHistoryItem(userId, cartItem.cart_item_id, addressId, creditCardId, orderDate);
      }

      await this.clearCart(cartId);
    } catch (error) {
      console.error("Error adding cart items to history: ", error);
      throw new Error("Error adding cart items to history");
    }
  }
}

module.exports = cartModel;