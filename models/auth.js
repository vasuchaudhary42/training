const { knex } = require('../libraries/postgresql');

function insertAuthEmail({ email, password }) {
    return knex('auth_email')
        .insert({
            email,
            password,
        })
        .onConflict('email')
        .merge();
}

function getPassword(email) {
    return knex('auth_email')
        .select('password')
        .where({
            email,
        })
        .then((res) => (res[0] ? res[0].password : null));
}

module.exports = {
    getPassword,
    insertAuthEmail,
};