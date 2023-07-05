require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./lib/logger');
const uploadsRouter = require('./routes/uploads');
const usersRouter = require('./routes/users');
const { tokenAuth, basicAuth } = require('./lib/auth');
const receiptsRouter = require('./routes/receipts');

let app = express();

app.use(logger);
app.use(cors());
app.use(tokenAuth);
app.use(basicAuth);
app.use('/uploads', uploadsRouter);
app.use('/users', usersRouter);
app.use('/receipts', receiptsRouter);

console.log("listening to: 3000");
app.listen(3000);