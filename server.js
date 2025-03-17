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
      secret: "jklfsodifjsktnwjasdp465dd", // A secret key used to sign the session ID cookie
      resave: true, // Forces the session to be saved back to the session store
      saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
      cookie: {
        maxAge: 3600000, // Sets the cookie expiration time in milliseconds (1 hour here)
        sameSite: true,
        httpOnly: true, // Reduces client-side script control over the cookie
        secure: false, // Ensures cookies are only sent over HTTPS //we do not impmentment HTTPS yet, so, this is false
      },
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