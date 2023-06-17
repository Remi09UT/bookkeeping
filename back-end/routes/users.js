const express = require('express');
const registerUserInDB = require('../db/users');
const bodyParser = require('body-parser');

let jsonBodyParser = bodyParser.json();

let registerUserRoute = async (req, res) => {
    const payload = req.body;
    try {
        const userID = await registerUserInDB(payload.username, payload.password);
        res.status(200).send({...payload, userID});
    } catch (error) {
        res.status(400).send({...error, message: error.message});
    }
};

let usersRouter = express.Router();

usersRouter.route('/register')
    .put(jsonBodyParser, registerUserRoute);

module.exports = usersRouter;