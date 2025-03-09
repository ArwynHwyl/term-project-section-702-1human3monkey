const express = require("express");
const db = require("./services/db");
const testDatabaseConnection = require("./services/testDatabaseConnection");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

async function startServer(db) {
  await testDatabaseConnection(db);

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })
}

app.get('/category', (req, res) => {
  const categories = [
    { name: 'SHIRT', icon: '/icons/tshirt.png', url: '/category/shirt' },
    { name: 'PANT', icon: '/icons/man.png', url: '/category/pant' },
    { name: 'HOOD', icon: '/icons/hoodie.png', url: '/category/hood' },
    { name: 'DRESS', icon: '/icons/dress.png', url: '/category/dress' }
  ];
  
  res.render('category', { categories });
});

startServer(db);