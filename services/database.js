const db = require("./db");

const createCategoryTableQuery = `
  CREATE TABLE Category (
    category_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(255)
  );
`;

const createProductTableQuery = `
  CREATE TABLE Product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    description VARCHAR(255),
    product_images VARCHAR(255),
    normal_price DECIMAL(10,2),
    promotion_percent DECIMAL(10,2),
    product_name VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
  );
`;

const createProductColorTableQuery = `
  CREATE TABLE ProductColor (
    product_color_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    color VARCHAR(255),
    quantity INT,
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
  );
`;

const createProductSizeTableQuery = `
  CREATE TABLE ProductSize (
    product_size_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    size VARCHAR(255),
    quantity INT,
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
  );
`;

const createUserTableQuery = `
  CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(255)
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(255),
  );
`;

const createAddressTableQuery = `
  CREATE TABLE Address (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    city VARCHAR(255),
    street VARCHAR(255),
    province VARCHAR(255),
    zip_code VARCHAR(255),
    phone_number VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
  );
`;

const createCreditCardTableQuery = `
  CREATE TABLE CreditCard (
    credit_card_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    card_number VARCHAR(255),
    expiration_date VARCHAR(255),
    cvv VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
  );
`;

const createCartTableQuery = `
  CREATE TABLE Cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
  );
`;

const createCartItemTableQuery = `
  CREATE TABLE CartItem (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT,
    product_id INT,
    product_color_id INT,
    product_size_id INT,
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (product_color_id) REFERENCES ProductColor(product_color_id),
    FOREIGN KEY (product_size_id) REFERENCES ProductSize(product_size_id),
  );
`;

const createHistoryTableQuery = `
  CREATE TABLE History (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    cart_item_id INT,
    status VARCHAR(255),
    order_date DATE,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (cart_item_id) REFERENCES CartItem(cart_item_id),
  );
`;