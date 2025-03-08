const express = require("express");
const db = require("./services/db");
const testDatabaseConnection = require("./services/testDatabaseConnection");
const path = require('path');
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views')); 
app.use('/public', express.static(path.join(__dirname, 'public')));
async function startServer(db) {
  await testDatabaseConnection(db);

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })
}

app.get('/backoffice', (req, res) => {
  const categories = [
    { name: 'Shirt', stock: 300 },
    { name: 'Pants', stock: 200 },
    { name: 'Hood', stock: 500 },
    { name: 'Dress', stock: 100 }
  ];
  res.render('pages/backoffice-category-page', { categories, activePage: 'categories' });
});
app.get('/backoffice/category', (req, res) => {
  const categories = [
    { name: 'Shirt', stock: 300 },
    { name: 'Pants', stock: 200 },
    { name: 'Hood', stock: 500 },
    { name: 'Dress', stock: 100 }
  ];
  res.render('pages/backoffice-category-page', { categories, activePage: 'categories' });
});

startServer(db);