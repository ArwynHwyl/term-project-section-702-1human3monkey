const express = require("express");
const db = require("./services/db");
const testDatabaseConnection = require("./services/testDatabaseConnection");
const createTables = require("./services/database");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

async function startServer(dbConnection) {
  await testDatabaseConnection(dbConnection);
  await createTables(dbConnection);

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })
}


startServer(db);