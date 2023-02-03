const { getUser, updateUser } = require("../services/user");

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
    },
    editUserProfile: async (req, res) => {
        const userid = req.session.userid;
        const {
            username,
        } = req.body;

        if(!username) {
            return res.status(400).json({
                reason: 'Please enter valid username',
            });
        }

        updateUser(userid, { username })
            .then((user) => {
                if(user && user.userid) {
                    return res.status(200).send({
                        message: 'User has been successfully updated!',
                        user
                    });
                }

                return Promise.reject({
                    status: 500,
                    reason: 'User could not be updated'
                });
            })
            .catch((error) => {
                console.log({
                    message: 'User could not be updated',
                    session: req.session,
                    error,
                })

                res.status(500).send({ reason: 'User could not be updated' });
            });
    }
};