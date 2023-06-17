require('dotenv').config();
const express = require('express');
const logger = require('./lib/logger');
const uploadsRouter = require('./routes/uploads');
const usersRouter = require('./routes/users');
const { tokenAuth, basicAuth } = require('./lib/auth');

let app = express();

app.use(logger);
app.use(tokenAuth);
app.use(basicAuth);
app.use('/uploads', uploadsRouter);
app.use('/users', usersRouter);

app.listen(3000);