const bcrypt = require('bcryptjs');

function createAuthController(userModel) {
    async function login(req, res) {
        const { email, password } = req.body;

        const user = await userModel.getUserByEmail(email);

        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).send('Invalid email or password');
        }

        res.send('Logged in');
    }

    async function register(req, res) {
        const { email, password, firstName, lastName } = req.body;

        const user = await userModel.getUserByEmail(email);

        if (user.length > 0) {
            console.log(user);
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.createUser({ email, password: hashedPassword, firstName, lastName });

        res.send('User created');
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