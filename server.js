const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const { db, config } = require("./services/db");
const testDatabaseConnection = require("./services/testDatabaseConnection");
const createTables = require("./services/database");
const path = require("path");
const createRouter = require("./routes/index");
const fs = require("fs");
const productRoute = require("./routes/productRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const createCategoryMiddleware = require("./middleware/categoryMiddleware");

const categoryMiddleware = createCategoryMiddleware(db);

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(categoryMiddleware);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function startServer(dbConnection) {
  await testDatabaseConnection(dbConnection);
  await createTables(dbConnection);

  app.locals.db = dbConnection;

  const sessionStore = new mysqlStore(config, dbConnection);

  app.use(
    session({
      store: sessionStore,
      secret: "jklfsodifjsktnwjasdp465dd",
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 3600000,
        sameSite: true,
        httpOnly: true,
        secure: false,
      },
    })
  );

  app.locals.session = session;

  app.use(createRouter(dbConnection));
  app.use("/api", productRoute);
  app.use("/category", categoryRoutes);

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
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.965940183367!2d100.49596631482264!3d13.744238990352118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e1a6f7e6b0d%3A0x7c1c1f8e6d0e0b1b!2sICONSIAM!5e0!3m2!1sen!2sth!4v1611608431910!5m2!1sen!2sth"
    };

    res.render("pages/contact", {
      pageTitle: title,
      pageDescription: description,
      pageContact: contact,
      session: req.session,
    });
  });

  app.get("/backoffice/history", async (req, res) => {
    try {
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

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

startServer(db);
