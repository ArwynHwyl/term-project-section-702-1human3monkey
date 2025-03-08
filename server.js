const express = require("express");
const db = require("./services/db");
const testDatabaseConnection = require("./services/testDatabaseConnection");
const createTables = require("./services/database");

const app = express();

async function startServer(dbConnection) {
  await testDatabaseConnection(dbConnection);
  await createTables(dbConnection);

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })
}


startServer(db);