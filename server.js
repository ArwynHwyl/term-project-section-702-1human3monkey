const express = require("express");
const db = require("./services/db");
const testDatabaseConnection = require("./services/testDatabaseConnection");
const createTables = require("./services/database");
const path = require("path");
const createRouter = require("./routes/index");
const bodyParser = require("body-parser");
const fs = require("fs");
const dotenv = require("dotenv");
const productRoute = require('./routes/productRoute');
const categoryRoutes = require("./routes/categoryRoutes");

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function startServer(dbConnection) {
  await testDatabaseConnection(dbConnection);
  await createTables(dbConnection);
  
  // Store the database connection in app.locals so it's accessible in routes
  app.locals.db = dbConnection;

  app.use(createRouter(dbConnection));
  app.use("/api", productRoute);
  app.use("/", categoryRoutes);

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/contact", (req, res) => {
    const title = "Contact US";
    const description =
      "We're here to help with any questions about our products or services.";

    const contact = {
      email: "dazzle@contactmail.com",
      phone: "088-999-1234",
      businessHours: "Sunday: 10:00 AM - 11:00 AM",
      address:
        "Milkyway galaxy, Earth, Asia Continent, Thailand, Bangkok, in the middle of chao phraya river",
      social: {
        facebook: "https://www.facebook.com/pha.satya.9",
        twitter: "https://www.twitter.com/elonmusk",
        instagram: "https://www.instagram.com/since22_arwynhwyl",
      },
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.965940183367!2d100.49596631482264!3d13.744238990352118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e1a6f7e6b0d%3A0x7c1c1f8e6d0e0b1b!2sICONSIAM!5e0!3m2!1sen!2sth!4v1611608431910!5m2!1sen!2sth",
    };

    res.render("contact", {
      pageTitle: title,
      pageDescription: description,
      pageContact: contact,
    });
  });

  app.get("/backoffice/product/edit/:id", async (req, res) => {
    try {
      const productId = req.params.id;
      
      // Get product details
      const [products] = await dbConnection.query(`
        SELECT p.*, c.category_name 
        FROM Product p
        LEFT JOIN Category c ON p.category_id = c.category_id
        WHERE p.product_id = ?
      `, [productId]);
      
      if (!products || products.length === 0) {
        return res.status(404).send("Product not found");
      }
      
      // Get product attributes
      const [variants] = await dbConnection.query(`
        SELECT color, size, quantity
        FROM ProductAttribute
        WHERE product_id = ?
      `, [productId]);
      
      const product = {
        product_id: products[0].product_id,
        image: products[0].image_path,
        name: products[0].product_name,
        category: products[0].category_name,
        description: products[0].description,
        normal_price: products[0].normal_price,
        discount_percent: products[0].discount_percent,
        variants: variants
      };
      
      res.render("pages/backoffice-product-edit-page", { product });
    } catch (error) {
      console.error("Error fetching product for edit:", error);
      res.status(500).send("Error loading product");
    }
  });

  app.get("/backoffice/history", async (req, res) => {
    try {
      // Get order history with details
      const [historyRecords] = await dbConnection.query(`
        SELECT h.history_id, h.user_id, h.order_date,
               p.product_name, pa.color, pa.size, ci.quantity,
               p.normal_price, p.discount_percent
        FROM History h
        JOIN CartItem ci ON h.cart_item_id = ci.cart_item_id
        JOIN Product p ON ci.product_id = p.product_id
        JOIN ProductAttribute pa ON ci.product_attribute_id = pa.product_attribute_id
        ORDER BY h.order_date DESC
      `);
      
      // Format the data for the view
      const history = historyRecords.map(record => {
        const discountedPrice = record.normal_price * (1 - (record.discount_percent / 100));
        const totalPrice = discountedPrice * record.quantity;
        
        return {
          userId: record.user_id,
          productname: record.product_name,
          color: record.color,
          size: record.size,
          quantity: `x ${record.quantity}`,
          price: `${totalPrice.toLocaleString()} THB`,
          status: record.status || "Completed",
          orderDate: new Date(record.order_date).toLocaleDateString()
        };
      });
      
      res.render("pages/backoffice-history-page", {
        history,
        activePage: "history",
      });
    } catch (error) {
      console.error("Error fetching order history:", error);
      res.render("pages/backoffice-history-page", {
        history: [],
        activePage: "history",
        error: "Failed to load order history"
      });
    }
  });

  app.get("/products", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12; // 12 products per page (4x3 grid)
      const offset = (page - 1) * limit;
      
      // Get products with pagination
      const [products] = await db.query(`
        SELECT p.*, c.category_name 
        FROM Product p
        LEFT JOIN Category c ON p.category_id = c.category_id
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `, [limit, offset]);
      
      // Get total count for pagination
      const [countResult] = await db.query(`
        SELECT COUNT(*) as total FROM Product
      `);
      
      const totalProducts = countResult[0].total;
      const totalPages = Math.ceil(totalProducts / limit);
      
      res.render("pages/all-products", {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts
        },
        pageTitle: "All Products"
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).render("pages/all-products", {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0
        },
        pageTitle: "All Products",
        error: "Failed to load products"
      });
    }
  });

  app.get("/product/:name/:id", (req, res) => {
    res.render("product", { productId: req.params.id });
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

startServer(db);