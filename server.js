const express = require("express");
const db = require("./services/db");
const testDatabaseConnection = require("./services/testDatabaseConnection");
const authRouter = require("./routes/auth");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

// use authRouter for all routes starting with /auth
app.use("/auth", authRouter);

async function startServer(db) {
  await testDatabaseConnection(db);

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/login", (req, res) => {
    res.render("pages/login");
  })

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })
}


startServer(db);