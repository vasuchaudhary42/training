const userModel = require('../models/user');
const crypto = require('crypto');

module.exports = {
    createUser: (user) => {
        const userid = crypto.randomUUID();
        return userModel.createUser({ userid, ...user }).then(() => {
            return { userid, ...user };
        });
    },
    getUserByEmail: userModel.getUserByEmail,
};