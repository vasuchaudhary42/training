const { knex } = require("../libraries/postgresql");

async function createUser(user) {
    return knex('users')
        .insert(user)
        .onConflict('email')
        .merge();
}

async function getUserByEmail(email) {
    return knex('users')
        .where({
            email,
        })
        .then((res) => res[0] || null);
}

module.exports = {
    createUser,
    getUserByEmail,
};