const userService = require("./user");
const authModel = require("../models/auth");
const authHelper = require("../helpers/auth");
const crypto = require("crypto");
const asde = require("../helpers/asde");

const AUTH_SECRET_KEY = "BYJUS_EXAM_PREP";
async function registerUser(user, password) {
    const [error, userDetails] = await asde(userService.getUserByEmail(user.email));
    console.log(userDetails)
    if(error) {
        console.log({
            message: 'Some error occurred while fetching user by email',
            error,
            user,
        });

        return Promise.reject({
            status: 500,
            reason: 'Some error occurred',
            isCustomError: true,
            isAlreadyLogged: true,
        });
    }

    if(userDetails && userDetails.userid) {
        console.log({
            message: 'Email already registered',
            user: userDetails,
        });

        return Promise.reject( {
            status: 409,
            reason: 'Email already registered',
            isCustomError: true,
            isAlreadyLogged: true,
        });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const [insertAuthEmailError] = await asde(authModel.insertAuthEmail({ email: user.email, password: passwordHash }));

    if(insertAuthEmailError) {
        console.log({
            message: 'Some error occurred while inserting the auth email',
            error: insertAuthEmailError,
            user,
        });

        return Promise.reject({
            status: 500,
            reason: 'Some error occurred',
            isCustomError: true,
            isAlreadyLogged: true,
        });
    }

    return userService
        .createUser(user)
        .catch((error) => {
            console.log({
                message: 'Some error occurred while creating the user',
                error,
                user,
            });

            return Promise.reject({
                status: 500,
                reason: 'Some error occurred',
                isCustomError: true,
                isAlreadyLogged: true,
            });
        });
}

async function getAuthToken(user) {
    return authHelper.generateJWT(user, AUTH_SECRET_KEY);
}

async function verifyAuthToken(token) {
    return authHelper.verifyJWT(token, AUTH_SECRET_KEY);
}

module.exports = {
    registerUser,
    getAuthToken,
    verifyAuthToken,
};