const express = require('express');

// let getUsersRoute = (req, res) => {
//     res.send(users);
// };

// let getUserRoute = (req, res) => {
//     let user = users.find(user => user.id === req.params.id);
//     res.send(user);
// };

let registerUserRoute = (req, res) => {

};

let usersRouter = express.Router();

// usersRouter.get('/:id', getUserRoute);
// usersRouter.get('/', getUsersRoute);

module.exports = usersRouter;