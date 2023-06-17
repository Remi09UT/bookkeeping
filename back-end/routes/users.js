const express = require('express');
const registerUserInDB = require('../db/users');
const bodyParser = require('body-parser');

let jsonBodyParser = bodyParser.json();

let registerUserRoute = async (req, res) => {
    const payload = req.body;
    const userID = await registerUserInDB(payload.username, payload.password);
    if (! userID) {res.sendStatus(400);}
    res.status(200);
    res.send({...payload, userID});
};

let usersRouter = express.Router();

usersRouter.route('/register')
    .put(jsonBodyParser, registerUserRoute);

module.exports = usersRouter;