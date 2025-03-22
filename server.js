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
