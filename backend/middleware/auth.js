const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/default.json');

const auth = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'missing token. authorization denied'})
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.id;

        if (req.body.id && req.body.id !== userId) {
            res.status(401).json({ message: 'invalid user id'})
        } else {
            next();
        }

    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

module.exports = auth;
