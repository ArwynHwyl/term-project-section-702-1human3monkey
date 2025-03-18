

function createCartController(cartModel, userModel) {
  async function addToCart(req, res) {
    try {
      const { product_id, product_attribute_id, quantity } = req.body;
      const userId = req.session.userId;

      // check if cart is existing
      const cart = await userModel.getCart(userId);
      const cartId = cart[0].cart_id;

      // Add product to cart
      const result = await cartModel.addCartItems(cartId, product_id, product_attribute_id, parseInt(quantity));

      if(result.affectedRows === 0) {
        return res.status(400).send("Failed to add to cart");
      }

      res.redirect("/products");
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).send("Error adding to cart");
    }
  }

  return {
    addToCart,
  }
}

module.exports = createCartController;