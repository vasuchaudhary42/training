const userModel = require('../models/user');
const crypto = require('crypto');

module.exports = {
    createUser: (user) => {
        const userid = crypto.randomUUID();
        const createdon = Date.now();
        return userModel.createUser({ userid, ...user, createdon }).then(() => {
            return { userid, ...user, createdon };
        });
    },
    getUserByEmail: userModel.getUserByEmail,
    getUser: userModel.getUser,
};