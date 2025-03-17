const express = require('express');
const router = express.Router();

// Sample product data (normally, this would come from a database)
const products = [
  {
    product_id: 1234,
    product_name: "Cotton sweatshirt",
    description: "Premium cotton blend with relaxed fit",
    image_path: "https://placehold.co/600x800?text=Cotton+Sweatshirt",
    normal_price: 1299,
    rating: 4.5,
    attributes: [
      { color: "Red", size: "XS", quantity: 15 },
      { color: "Yellow", size: "M", quantity: 0 },
      { color: "White", size: "L", quantity: 0 }
    ],
    features: ["Style #20346Y1234", "Oversized relaxed fit"]
  },
  {
    product_id: 5678,
    product_name: "Denim Jacket",
    description: "Classic blue denim with modern fit",
    image_path: "https://placehold.co/600x800?text=Denim+Jacket",
    normal_price: 1999,
    rating: 4.8,
    attributes: [
      { color: "Blue", size: "S", quantity: 10 },
      { color: "Blue", size: "M", quantity: 5 }
    ],
    features: ["Timeless denim look", "Comfortable fit"]
  }
];

// Route to get a product by its ID
router.get('/product/:id', (req, res) => {
  const { id } = req.params;

  // Find the product by ID
  const product = products.find(p => p.product_id == id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Return the product as JSON
  res.json(product);
});

// You can add other product-related routes here, for example:
// - Post a new product
// - Update a product
// - Delete a product

module.exports = router;