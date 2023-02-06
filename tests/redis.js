const redis = require("../libraries/redis");
const product = {
    id: 1,
    title: "Iphone",
    price: 100000,
    variant: 14,
    quantity: 1000,
};

const key = 'product_' + product.id;
const value = JSON.stringify(product);
const incr_key = 'orders_for_product_' + product.id;

/**
 * Method: set
 * Syntax: SET key value
 * Return: OK if SET was executed correctly.
 */
// console.log("SET: ", await redis.set(key, value));

/**
 * Method: get
 * Syntax: GET key
 * Return: The value of key, or nil when key does not exist.
 */
console.log("GET: ", await redis.get(key));

/**
 * Method: del
 * Syntax: DEL key [key ...]
 * Return: The number of keys that were removed.
 */
// console.log("DEL: ", await redis.del(key));
// console.log("DEL: ", await redis.del([ key, incr_key ]));

/**
 * Method: expire
 * Syntax: EXPIRE key seconds
 * Return: 1 if the timeout was set and 0 if the timeout was not set
 */
// console.log("EXPIRE: ", await redis.expire(key, 30));


/**
 * Method: setEx
 * Syntax: SETEX key seconds value
 * Return: OK if SET was executed correctly.
 */
// console.log("SETEX: ", await redis.setEx(key, 20, value));

/**
 * Method: incr
 * Syntax: INCR key
 * Return: The value of key after the increment
 */
// console.log("INCR: ", await redis.incr(incr_key));