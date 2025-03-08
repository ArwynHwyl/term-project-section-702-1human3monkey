const express = require("express");
const db = require("./services/db");
const testDatabaseConnection = require("./services/testDatabaseConnection");
const createTables = require("./services/database");

const app = express();

async function startServer(db) {
  await testDatabaseConnection(db);
  await createTables(db);

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })
}


startServer(db);