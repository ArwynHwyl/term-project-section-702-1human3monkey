const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('pages/authen/login', { pageTitle: 'Sign in to your account' });
});

router.get('/register', (req, res) => {
    res.render('pages/authen/register', { pageTitle: 'Create an account' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

});

module.exports = router;