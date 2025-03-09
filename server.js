const express = require("express");
const db = require("./services/db");
const testDatabaseConnection = require("./services/testDatabaseConnection");
const path = require('path');
const createRouter = require("./routes/index");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views')); 
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startServer(dbConnection) {
  await testDatabaseConnection(dbConnection);

  app.use(createRouter(dbConnection));

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })
}

startServer(db);