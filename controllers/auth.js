const authService = require('../services/auth');
const asde = require("../helpers/asde");
const authHelper = require('../helpers/auth');

async function registration(req, res) {
    const {
        username,
        email,
        password,
    } = req.body;

    if(!username || !email || !password) {
        return res.json({
            status: 400,
            reason: 'Please enter valid username, email and password',
        });
    }

    const [error, user] = await asde(authService.registerUser({
        username,
        email,
    }, password));

    if(error || !user) {
        if(!error.isAlreadyLogged) {
            console.log({
                message: 'Some error occurred while registering the user',
                username,
                email,
                error,
            });
        }

        return res.status((error.isCustomError && error.status) || 401).json({
            reason: (error.isCustomError && error.reason) || 'Some error occurred',
        });
    }

    const [generateTokenError, authToken] = await asde(authService.getAuthToken(user));

    if(generateTokenError || !authToken) {
        if(!generateTokenError.isAlreadyLogged) {
            console.log({
                message: 'Some error occurred while generating token',
                user,
                error: generateTokenError,
            });
        }

        return res.status((error.isCustomError && error.status) || 401).json({
            reason: (error.isCustomError && error.reason) || 'Some error occurred',
        });
    }

    return res.status(200).json({
        message: 'User has been successfully registered!',
        user,
        token: authToken,
    });
}

module.exports = {
    registration,
};