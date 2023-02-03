const userModel = require('../models/user');
const crypto = require('crypto');
const asde = require('../helpers/asde');
const redis = require('../libraries/redis');

const expireTime = 24 * 60 * 60;
const getUserCacheKey = (userid) => {
    return 'user_' + userid;
};

module.exports = {
    createUser: (user) => {
        const userid = crypto.randomUUID();
        const createdon = Date.now();
        return userModel.createUser({ userid, ...user, createdon }).then(() => {
            const userDetails = { userid, ...user, createdon };

            const cacheKey = getUserCacheKey(userid);
            redis.setEx(cacheKey, expireTime, JSON.stringify(userDetails));

            return userDetails;
        });
    },
    getUserByEmail: userModel.getUserByEmail,
    getUser: async (userid) => {
        const cacheKey = getUserCacheKey(userid);
        const [, userDetails] = await asde(redis.get(cacheKey))

        if(userDetails) {
            return JSON.parse(userDetails);
        }

        return userModel.getUser(userid).then((userDetails) => {
            const cacheKey = getUserCacheKey(userid);
            redis.setEx(cacheKey, expireTime, JSON.stringify(userDetails));

            return userDetails;
        });
    },
    updateUser: (userid, updateDetails) => {
        return userModel.updateUser(userid, updateDetails)
            .then(async (user) => {
                const cacheKey = getUserCacheKey(userid);
                await asde(redis.del(cacheKey))

                return user;
            });
    }
};