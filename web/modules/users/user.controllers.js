const User = require('./user.model');

module.exports = {

    signUp: async function signUp(req, res) {
        try {
            User.create(req.body)
                .then(user => res.status(201).json(user));
        } catch (e) {
            return res.status(500).json(e);
        }
    }
}
