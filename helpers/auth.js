const jwt = require("jsonwebtoken");

async function generateJWT(payload, secretKey, expiresIn = "10d") {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            secretKey,
            {
                expiresIn,
            },
            function (error, token) {
                if (error) {
                    console.log({
                        message: 'Token generation failed',
                        error,
                        payload,
                        expiresIn,
                    });

                    return reject({
                        status: 500,
                        reason: 'Token generation failed',
                    });
                }

                resolve(token);
            }
        )
    });
}

async function verifyJWT(token, secretKey) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, function(error, decoded) {
            if(error) {
                console.log({
                    message: error.message || 'Invalid Token',
                    token,
                    error,
                });

                const customError = {
                    status: 401,
                    reason: 'invalid token',
                    isCustomError: true,
                    isAlreadyLogged: true,
                };

                switch (error.name) {
                    case "TokenExpiredError":
                        customError.reason = 'token expired';
                        break;
                    case "NotBeforeError":
                        customError.reason = 'token not active';
                        break;
                    case "JsonWebTokenError":
                    default:
                        customError.reason = 'invalid token';
                        break;
                }

                return reject(customError);
            }

            resolve(decoded);
        })
    })
}

module.exports = {
    generateJWT,
    verifyJWT,
}