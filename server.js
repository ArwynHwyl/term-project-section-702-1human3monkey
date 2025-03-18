const express = require("express");
const db = require("./services/db");
const testDatabaseConnection = require("./services/testDatabaseConnection");
const createTables = require("./services/database");
const path = require('path');
const createRouter = require("./routes/index");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views')); 
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}



async function startServer(dbConnection) {
  await testDatabaseConnection(dbConnection);
  await createTables(dbConnection);

  app.use(createRouter(dbConnection));

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/contact", (req, res) => {
    const title = "Contact US";
    const description = "We're here to help with any questions about our products or services.";

    const contact = {
      email: "dazzle@contactmail.com",
      phone: "088-999-1234",
      businessHours: "Sunday: 10:00 AM - 11:00 AM",
      address: "Milkyway galaxy, Earth, Asia Continent, Thailand, Bangkok, in the middle of chao phraya river",
      social: {
        facebook: "https://www.facebook.com/pha.satya.9",
        twitter: "https://www.twitter.com/elonmusk",
        instagram: "https://www.instagram.com/since22_arwynhwyl"
      },
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.965940183367!2d100.49596631482264!3d13.744238990352118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e1a6f7e6b0d%3A0x7c1c1f8e6d0e0b1b!2sICONSIAM!5e0!3m2!1sen!2sth!4v1611608431910!5m2!1sen!2sth"
    }


    res.render("contact", {
      pageTitle: title,
      pageDescription: description,
      pageContact: contact
    });
  });
  app.get('/backoffice/product/edit/:id', (req, res) => {
    const product = {
      image: 'https://via.placeholder.com/100',
      name: 'Hoodie',
      category: 'Hood',
      variants: [
        { color: 'red', size: 'XL', quantity: 10 },
        { color: 'red', size: 'L', quantity: 10 },
        { color: 'black', size: 'S', quantity: 0 }
      ]
    };
    res.render('pages/backoffice-product-edit-page', { product });
  });
  app.get('/backoffice/history', (req, res) => {
    const history = [
      { userId: '1123', productname: 'Hoodie', color: 'Black', size: 'Hood', quantity: 'x 50000', price: '2,252.231 THB', status: '' },
      { userId: 'h123', productname: 'Elephant Pant', color: 'Vintage Washed Elephant Pant', size: 'Pants', quantity: '1000 THB', price: '0.000011 THB', status: '' }
    ];
    res.render('pages/backoffice-history-page', { history, activePage: 'history' });
  });


  app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views', 'pages')
  ]);
  const mockData = {
    order: {
      products: [
        {
          name: "Product 1",
          size: "L",
          color: "Red",
          price: 12989,
          currency: "THB",
          quantity: 1,
          src: "https://picsum.photos/200/300" // เปลี่ยนจาก imageUrl เป็น src และตรวจสอบว่าไฟล์นี้อยู่ใน /public/images/
        },
        {
          name: "Product 2",
          size: "L",
          color: "Red",
          price: 12989,
          currency: "THB",
          quantity: 1,
          src: "/images/product.jpg" // เปลี่ยนจาก imageUrl เป็น src และตรวจสอบว่าไฟล์นี้อยู่ใน /public/images/
        },{
          name: "Product 2",
          size: "L",
          color: "Red",
          price: 12989,
          currency: "THB",
          quantity: 1,
          src: "/images/product.jpg" // เปลี่ยนจาก imageUrl เป็น src และตรวจสอบว่าไฟล์นี้อยู่ใน /public/images/
        },{
          name: "Product 1",
          size: "L",
          color: "Red",
          price: 12989,
          currency: "THB",
          quantity: 1,
          src: "https://picsum.photos/200/300" // เปลี่ยนจาก imageUrl เป็น src และตรวจสอบว่าไฟล์นี้อยู่ใน /public/images/
        },{
          name: "Product 1",
          size: "L",
          color: "Red",
          price: 12989,
          currency: "THB",
          quantity: 1,
          src: "https://picsum.photos/200/300" // เปลี่ยนจาก imageUrl เป็น src และตรวจสอบว่าไฟล์นี้อยู่ใน /public/images/
        },{
          name: "Product 1",
          size: "L",
          color: "Red",
          price: 12989,
          currency: "THB",
          quantity: 1,
          src: "https://picsum.photos/200/300" // เปลี่ยนจาก imageUrl เป็น src และตรวจสอบว่าไฟล์นี้อยู่ใน /public/images/
        },{
          name: "Product 1",
          size: "L",
          color: "Red",
          price: 12989,
          currency: "THB",
          quantity: 1,
          src: "https://picsum.photos/200/300" // เปลี่ยนจาก imageUrl เป็น src และตรวจสอบว่าไฟล์นี้อยู่ใน /public/images/
        }
      ],
      shipping: {
        cost: 50,
        currency: "THB"
      }
    },
    customer: {
      contact: {
        email: "example@example.com"
      },
      delivery: {
        country: "Thailand",
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        city: "Bangkok",
        province: "Bangkok",
        postalCode: "10100",
        phone: "0123456789"
      },
      payment: {
        cardNumber: "1234 5678 9012 3456",
        expiryDate: "12/25",
        securityCode: "123"
      }
    }
  };
  
  app.get('/checkout', (req, res) => {
    res.render('pages/checkout', { data: mockData });
  });
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })
}


startServer(db);