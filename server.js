const express = require("express");
const db = require("./config/db");

const app = express();

async function testDatabaseConnection() {
  try {
    const connection = await db.getConnection();
    console.log("Database connected successfully!");

    connection.release();
  } catch (error) {
    console.error("ERROR: Failed to connect to MySQL: ", error.message);
    process.exit(1);
  }
}

async function startServer() {
  await testDatabaseConnection();

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })
}


startServer();