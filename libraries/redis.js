const redis = require('redis');

const client = redis.createClient();
client.connect().then(() => console.log('Redis Connected!')).catch((error) => console.log({ message: 'Redis Connection Failed!', error, }));

module.exports = client;