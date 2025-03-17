const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const { db, config } = require("./services/db");
const testDatabaseConnection = require("./services/testDatabaseConnection");
const createRouter = require("./routes/index");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// use authRouter for all routes starting with /auth
// app.use("/auth", authRouter);

async function startServer(db) {
  await testDatabaseConnection(db);

  // Set up session store
  const sessionStore = new mysqlStore(config, db);

  app.use(
    session({
      store: sessionStore,
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
        sameSite: true,
        httpOnly: true,
        secure: false // Set to true in production with HTTPS
      }
    })
  )

  app.use(createRouter(db));

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })
}


startServer(db);