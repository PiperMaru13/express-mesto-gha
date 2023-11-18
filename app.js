require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const httpStatus = require('./utils/errorstatus');
const { errorHandler } = require('./middlewares/errorHandler');

const { PORT = 3000, DEV_SECRET = '655567d1682364adfaca9652', MY_DB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(MY_DB)
  .then(() => {
    console.log('Connection enabled');
  })
  .catch((err) => {
    console.log('Error:', err);
  });

app.use(cookieParser());
app.use(bodyParser.json());
app.use(router);
app.use((req, res) => {
  res.status(httpStatus.notFound).json({ message: 'Такой страницы не существует' });
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = { DEV_SECRET };
