require('dotenv').config();
const express = require('express');
const logger = require('./lib/logger');
const uploadsRouter = require('./routes/uploads');

let app = express();

app.use(logger);
app.use('/uploads', uploadsRouter);

app.listen(3000);