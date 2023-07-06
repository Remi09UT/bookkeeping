require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./lib/logger');
const uploadsRouter = require('./routes/uploads');
const usersRouter = require('./routes/users');
const { tokenAuth, basicAuth } = require('./lib/auth');
const receiptsRouter = require('./routes/receipts');

const PORT = 3000;

let app = express();

app.use(logger);
app.use(cors());
app.use(tokenAuth);
app.use(basicAuth);
app.use('/uploads', uploadsRouter);
app.use('/users', usersRouter);
app.use('/receipts', receiptsRouter);

console.log(`listening to: ${PORT}`);
app.listen(PORT);