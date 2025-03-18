const express = require('express');
const router = express.Router();
const cartModel = require('../models/cartModel');
const cartController = require('../controllers/cartController');
// const creditCardModel = require('../models/creditCardModel');
// const creditCardController = require('../controllers/creditCardController');

function createCartRoute(db){
    const cart = new cartModel(db);
    const controller = new cartController(cart);

    router.post('/add', controller.addToCart);
    // router.delete('/delete/:id', controller.deleteFromCart);
    // router.put('/update/:id', controller.updateCart);

    return router;
}

module.exports = createCartRoute;