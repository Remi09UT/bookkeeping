const {AuthenticationFailureError, PasswordAuthenticationFailureError, JWTAuthenticationFailureError} = require('./errors');
const {getUserByUsernameInDB} = require('../db/users');
const jwt = require('jsonwebtoken');

const signature = process.env.SIGNATURE;

let basicAuth = async (req, res, next) => {
    let header = req.headers.authorization || '';
    let [type, payload] = header.split(' ');

    if (type === 'Basic') {
        let credentials = Buffer.from(payload, 'base64').toString('ascii');
        let [username, password] = credentials.split(':');
        try {
            const user = await getUserByUsernameInDB(username);
            if (user.password !== password) {
                throw new PasswordAuthenticationFailureError(`Invalid password for user: ${username}`);
            }
            req.user = user;
        } catch (error) {
            res.status(error.status || 400).send({...error, message: error.message});
            return;
        }
    }
    
    next();
};

let tokenAuth = async (req, res, next) => {
    let header = req.headers.authorization || '';
    let [type, token] = header.split(' ');

    if (type === 'Bearer') {
        let payload;
        // JWT Verification
        try {
            payload = jwt.verify(token, signature);
        } catch(error) {
            const jwtError = new JWTAuthenticationFailureError(error.message);
            res.status(jwtError.status || 400).send({...jwtError, message: jwtError.message});
            return;
        }
        // User Object Assignment
        try {
            const user = await getUserByUsernameInDB(payload.username);
            req.user = user;
        } catch (error) {
            res.status(error.status || 400).send({...error, message: error.message});
            return;
        }
    }

    next();
}

let requireAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        const error = new AuthenticationFailureError("Authentication required!");
        res.status(error.status || 400).send({...error, message: error.message});
    }
};

module.exports = {basicAuth, tokenAuth, requireAuth};