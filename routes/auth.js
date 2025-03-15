const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('pages/authen/login', { pageTitle: 'Sign in to your account' });
});

router.get('/register', (req, res) => {
    res.render('pages/authen/register', { pageTitle: 'Create an account' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Email:', email);
    console.log('Password, length:', password.length);
});

router.post('/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    console.log('Email:', email);
    console.log('Password, length:', password.length);
    console.log('First name:', firstName);
    console.log('Last name:', lastName);
});

module.exports = router;