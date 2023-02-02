const knexObject = require('knex');
const pg = require('pg');

pg.types.setTypeParser(20, Number)
pg.types.setTypeParser(1082, (a) => new Date(new Date(a).getTime() + 19_800_000 + (new Date().getTimezoneOffset() * 60_000)));

const knexConfig = {
    client: 'postgresql',
    connection: {
        database: 'training',
        user:     'gradeup',
        password: null
    },
    pool: {
        min: 2,
        max: 10,
        idleTimeoutMillis: 2000, // free resources are destroyed after this many milliseconds
        reapIntervalMillis: 1000, // how frequent to check for idle resources to destroy
    },
};

// postgres://gradeup:@localhost:5432/training
const knex = knexObject(knexConfig);

function closePostgresConnections() {
    return knex.destroy();
}

module.exports = {
    knex,
    closePostgresConnections,
};
