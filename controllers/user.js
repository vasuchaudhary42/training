const { getUser } = require("../services/user");
module.exports = {
    me: async (req, res) => {
        getUser(req.session.userid)
            .then((user) => {
                if(user && user.userid) {
                    return res.status(200).json(user);
                }

                return Promise.reject({
                    status: 401,
                    message: 'Unauthorized Request'
                });
            })
            .catch((error) => {
                console.log({
                    message: 'Unauthorized Request',
                    session: req.session,
                    error,
                })

                res.status(401).send({ status: 401, message: 'Unauthorized Request' });
            });
    }
};