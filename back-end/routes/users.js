const express = require('express');
const {registerUserInDB} = require('../db/users');
const bodyParser = require('body-parser');
const createToken = require('../lib/create-token');
const {requireAuth} = require('../lib/auth');

let jsonBodyParser = bodyParser.json();

/**
 * User register route
 * requires {username, password}
 * returns {username, password, userID}
 */
let registerUserRoute = async (req, res) => {
    const payload = req.body;
    try {
        const userID = await registerUserInDB(payload.username, payload.password);
        res.status(201).send({...payload, userID});
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message});
    }
};

/**
 * User login route
 * requires {auth user object}
 * returns {JSON Web Token}
 */
let loginUserRoute = async (req, res) => {
    const user = req.user;
    const token = createToken(user);
    res.status(201).send({token});
};

let usersRouter = express.Router();

usersRouter.route('/register')
    .put(jsonBodyParser, registerUserRoute);

usersRouter.route('/login')
    .get(requireAuth, loginUserRoute);

module.exports = usersRouter;