const bcrypt = require('bcryptjs');

function createAuthController(userModel) {
    async function login(req, res) {
        const { email, password } = req.body;

        const user = await userModel.getUserByEmail(email);

        if (!user || user.length === 0) {
            return res.render('pages/authen/login',
                {
                    pageTitle: 'Sign in to your account',
                    errorMessage: "Email not found, please try again",
                });
        }

        const validPassword = await bcrypt.compare(password, user[0].password);

        if (!validPassword) {
            return res.render('pages/authen/login',
                {
                    pageTitle: 'Sign in to your account',
                    errorMessage: "Invalid password, please try again",
                });
        }

        res.send('Logged in');
    }

    async function register(req, res) {
        const { email, password, firstName, lastName } = req.body;

        const user = await userModel.getUserByEmail(email);

        if (user.length > 0) {
            return res.render('pages/authen/register',
                {
                    pageTitle: 'Create an account',
                    errorMessage: 'Email already exists, please try again',
                });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.createUser({ email, password: hashedPassword, firstName, lastName });

        res.redirect('/auth/login');
    }

    async function logout(req, res) {
        res.send('Logged out');
    }

    return {
        login,
        register,
        logout
    }
}

module.exports = createAuthController;