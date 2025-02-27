const express = require("express");
const db = require("./services/db");
const testDatabaseConnection = require("./services/testDatabaseConnection");

const app = express();

async function startServer(db) {
  await testDatabaseConnection(db);

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })
}


startServer(db);