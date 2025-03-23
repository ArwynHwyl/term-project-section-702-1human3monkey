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
const categoryRoutes = require("./routes/categoryRoute");
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

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

startServer(db);
