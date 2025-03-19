const express = require('express');
const router = express.Router();
const CartModel = require('../models/cartModel');
const UserModel = require('../models/userModel');
const AuthController = require('../controllers/authController');
const CreditCardModel = require('../models/creditCardModel');
const AddressModel = require('../models/addressModel');

function createCheckoutRoute(db) {
    const cartModel = new CartModel(db);
    const userModel = new UserModel(db);
    const creditCardModel = new CreditCardModel(db);
    const addressModel = new AddressModel(db);
    const authController = new AuthController(userModel);

    router.get('/', authController.authentication, async (req, res) => {
        try {
            // get cartId from user session
            const [cart_id] = await userModel.getCart(req.session.userId);

            // get cart items by cart id
            const cartItems = await cartModel.getCartItemsByIds(cart_id.cart_id);

            const cardInfo = await creditCardModel.getCreditCardsByUserId(req.session.userId);
            const addressInfo = await addressModel.getAddressByUserId(req.session.userId);

            const mockData = {
                order: {
                    products: cartItems,
                    shipping: {
                        cost: 50,
                        currency: "THB"
                    }
                },
                customer: {
                    delivery: addressInfo,
                    payment: cardInfo
                }
            };

            res.render('pages/checkout', { data: mockData, session: req.session });
        } catch (error) {
            console.error("Error getting cart items:", error);
            res.status(500).send("Error getting cart items");
        }
    });

    router.post('/', authController.authentication, async (req, res) => {
        try {
            const { card_id, address_id } = req.body;
            const [cart_id] = await userModel.getCart(req.session.userId);

            const cartItems = await cartModel.getCartItemsByIds(cart_id.cart_id);

            const cardInfo = await creditCardModel.getCreditCardById(card_id);
            const addressInfo = await addressModel.getAddressById(address_id);

            const order = {
                products: cartItems,
                shipping: {
                    cost: 50,
                    currency: "THB"
                },
                payment: cardInfo,
                delivery: addressInfo
            };

            // create order
            const order_id = await userModel.createOrder(req.session.userId, order);

            // clear cart
            await cartModel.clearCart(cart_id.cart_id);

            res.redirect(`/order/${order_id}`);
        } catch (error) {
            console.error("Error checking out:", error);
            res.status(500).send("Error checking out");
        }
    });

    return router;
}

module.exports = createCheckoutRoute;