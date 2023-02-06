const userService = require("./user");
const authModel = require("../models/auth");
const authHelper = require("../helpers/auth");
const crypto = require("crypto");
const asde = require("../helpers/asde");

const AUTH_SECRET_KEY = "BYJUS_EXAM_PREP";
async function registerUser(user, password) {
    const [error, userDetails] = await asde(userService.getUserByEmail(user.email));

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

async function login(email, password) {
    const [error, user] = await asde(userService.getUserByEmail(email));

    if(error) {
        console.log({
            message: 'Some error occurred while fetching user by email',
            error,
            email,
        });

        return Promise.reject({
            status: 500,
            reason: 'Some error occurred',
            isCustomError: true,
            isAlreadyLogged: true,
        });
    }

    if(!user || !user.userid) {
        console.log({
            message: 'Please sign-up first',
            email,
        });

        return Promise.reject({
            status: 401,
            reason: 'Please sign-up first',
            isCustomError: true,
            isAlreadyLogged: true,
        });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const [passwordError, userPasswordHash] = await asde(authModel.getPassword(email));

    if(passwordError) {
        console.log({
            message: 'Some error occurred while fetching user auth',
            error: passwordError,
            email,
        });

        return Promise.reject({
            status: 500,
            reason: 'Some error occurred',
            isCustomError: true,
            isAlreadyLogged: true,
        });
    }

    if(passwordHash === userPasswordHash) {
        return user;
    }

    console.log({
        message: 'Password doesn\'t match',
        email,
    });

    return Promise.reject({
        status: 401,
        reason: 'Please enter valid username and password',
        isCustomError: true,
        isAlreadyLogged: true,
    });
}

async function getAuthToken(user) {
    return authHelper.generateJWT({
        userid: user.userid,
    }, AUTH_SECRET_KEY);
}

async function verifyAuthToken(token) {
    return authHelper.verifyJWT(token, AUTH_SECRET_KEY);
}

module.exports = {
    registerUser,
    login,
    getAuthToken,
    verifyAuthToken,
};