const authService = require('../services/auth');
const asde = require('../helpers/asde');

module.exports = async (request, res, next) => {

    if (!request.headers.authorization || !request.headers.authorization.includes('Bearer ')) {
        return res.status(401).send({ status: 401, message: 'Unauthorized Request' });
    }

    const token = request.headers.authorization.split(' ')[1];

    const [error, payload] = await asde(authService.verifyAuthToken(token));

    if (error || !payload) {
        return res.status(401).send({ status: 401, message: 'Unauthorized Request' });
    }

    request.session = payload;

    next();
};