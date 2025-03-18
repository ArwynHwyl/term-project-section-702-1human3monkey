const express = require("express");
const createBackofficeCategoryRoute = require("./backofficeCategoryRoute");
const createBackofficeProductRoute = require("./backofficeProductRoute");

function createRouter(db) {
  const router = express.Router();

  router.get("/contact", authController.authentication, (req, res) => {
    const title = "Contact US";
    const description =
      "We're here to help with any questions about our products or services.";

    const contact = {
      email: "dazzle@contactmail.com",
      phone: "088-999-1234",
      businessHours: "Sunday: 10:00 AM - 11:00 AM",
      address:
        "Milkyway galaxy, Earth, Asia Continent, Thailand, Bangkok, in the middle of chao phraya river",
      social: {
        facebook: "https://www.facebook.com/zuck/",
        twitter: "https://www.twitter.com/elonmusk",
        instagram: "https://www.instagram.com/elonrmuskk/",
      },
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.965940183367!2d100.49596631482264!3d13.744238990352118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e1a6f7e6b0d%3A0x7c1c1f8e6d0e0b1b!2sICONSIAM!5e0!3m2!1sen!2sth!4v1611608431910!5m2!1sen!2sth",
    };

    res.render("pages/contact", {
      pageTitle: title,
      pageDescription: description,
      pageContact: contact,
      session: req.session,
    });
  });

  router.get("/backoffice", (req, res) => {
    res.redirect("/backoffice/category");
  });

  router.use(createBackofficeCategoryRoute(db));
  router.use(createBackofficeProductRoute(db));

  return router;
}

module.exports = createRouter;