/**
 * Product Controller
 * Handles all product-related business logic
 */

// Get a single product by ID with its attributes
const session = require('express-session');
const model = require('../models/productModel');
const { db } = require('../services/db');
const productModel = new model(db);

async function getProductById(req, res) {
  try {
    const db = req.app.locals.db;
    const productId = req.params.id;
    
    // Get basic product info
    const [products] = await db.query(`
      SELECT p.*, c.category_name 
      FROM Product p
      LEFT JOIN Category c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `, [productId]);
    
    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Get product attributes (sizes, colors, quantities)
    const [attributes] = await db.query(`
      SELECT product_attribute_id, color, size, quantity
      FROM ProductAttribute
      WHERE product_id = ?
    `, [productId]);
    
    // Format the response
    const productData = {
      ...products[0],
      attributes: attributes,
      features: [] // Optional: You could add a separate table for product features
    };
    
    res.json(productData);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

// Get all products with optional filtering
async function getAllProducts(req, res) {
  try {
    const db = req.app.locals.db;
    const { category, search, limit = 16, page = 1 } = req.query;
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Build the query based on filters
    let query = `
      SELECT p.*, c.category_name 
      FROM Product p
      LEFT JOIN Category c ON p.category_id = c.category_id
      WHERE 1=1
    `;
    
    const queryParams = [];
    
    // Add category filter if provided
    if (category) {
      query += ` AND c.category_id = ?`;
      queryParams.push(category);
    }
    
    // Add search filter if provided
    if (search) {
      query += ` AND (p.product_name LIKE ? OR p.description LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // Execute the query
    const [products] = await db.query(query, queryParams);
    
    // Get total count for pagination
    const [countResult] = await db.query(`
      SELECT COUNT(*) as total
      FROM Product p
      LEFT JOIN Category c ON p.category_id = c.category_id
      WHERE 1=1
      ${category ? ' AND c.category_id = ?' : ''}
      ${search ? ' AND (p.product_name LIKE ? OR p.description LIKE ?)' : ''}
    `, queryParams.slice(0, queryParams.length - 2));
    
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);
    
    res.json({
      products,
      pagination: {
        total: totalProducts,
        currentPage: parseInt(page),
        totalPages,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

// Create a new product
async function createProduct(req, res) {
  try {
    const db = req.app.locals.db;
    const { 
      category_id, 
      product_name, 
      description, 
      image_path, 
      normal_price, 
      discount_percent = 0,
      attributes = []
    } = req.body;
    
    // Validate required fields
    if (!category_id || !product_name || !normal_price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Insert product
    const [result] = await db.query(`
      INSERT INTO Product (
        category_id, 
        product_name, 
        description, 
        image_path, 
        normal_price, 
        discount_percent,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, [
      category_id, 
      product_name, 
      description || null, 
      image_path || null, 
      normal_price, 
      discount_percent
    ]);
    
    const productId = result.insertId;
    
    // Insert product attributes if provided
    if (attributes && attributes.length > 0) {
      const attributeValues = attributes.map(attr => 
        [productId, attr.color, attr.size, attr.quantity]
      );
      
      await db.query(`
        INSERT INTO ProductAttribute (product_id, color, size, quantity)
        VALUES ?
      `, [attributeValues]);
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Product created successfully',
      productId 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

// Update an existing product
async function updateProduct(req, res) {
  try {
    const db = req.app.locals.db;
    const productId = req.params.id;
    const { 
      category_id, 
      product_name, 
      description, 
      image_path, 
      normal_price, 
      discount_percent,
      attributes = []
    } = req.body;
    
    // Update product
    await db.query(`
      UPDATE Product SET
        category_id = ?,
        product_name = ?,
        description = ?,
        image_path = ?,
        normal_price = ?,
        discount_percent = ?
      WHERE product_id = ?
    `, [
      category_id, 
      product_name, 
      description || null, 
      image_path || null, 
      normal_price, 
      discount_percent || 0,
      productId
    ]);
    
    // Handle attributes updates
    if (attributes && attributes.length > 0) {
      // Delete existing attributes
      await db.query('DELETE FROM ProductAttribute WHERE product_id = ?', [productId]);
      
      // Insert new attributes
      const attributeValues = attributes.map(attr => 
        [productId, attr.color, attr.size, attr.quantity]
      );
      
      await db.query(`
        INSERT INTO ProductAttribute (product_id, color, size, quantity)
        VALUES ?
      `, [attributeValues]);
    }
    
    res.json({ 
      success: true, 
      message: 'Product updated successfully' 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

// Delete a product
async function deleteProduct(req, res) {
  try {
    const db = req.app.locals.db;
    const productId = req.params.id;
    
    // Delete product attributes first (due to foreign key constraint)
    await db.query('DELETE FROM ProductAttribute WHERE product_id = ?', [productId]);
    
    // Delete the product
    await db.query('DELETE FROM Product WHERE product_id = ?', [productId]);
    
    res.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const searchResults = await productModel.searchProducts(searchQuery);

    res.render('pages/search-product', { 
      products: searchResults,
      pageTitle: "Search Products",
      session: req.session
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

module.exports = {
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
};