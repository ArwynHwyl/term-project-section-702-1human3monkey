const db = require("./db");

const createProductTableQuery = `
  CREATE TABLE Product (
      product_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      category_id INT,
      description TEXT,
      product_images TEXT,
      normal_price DECIMAL(10,2),
      promotion_price DECIMAL(10,2),
      product_name VARCHAR(255),
      created_at DATE,
      FOREIGN KEY (category_id) REFERENCES Category(category_id)
  );
`;

const createCategoryTableQuery = `
  CREATE TABLE Category (
      category_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      category_name VARCHAR(255)
  );
`;