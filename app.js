const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');
const httpStatus = require('./utils/errorstatus');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Connection enabled');
  })
  .catch((err) => {
    console.log('Error:', err);
  });

app.use((req, res, next) => {
  req.user = {
    _id: '655567d1682364adfaca9652', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(bodyParser.json());
app.use(router);
app.use((req, res) => {
  res.status(httpStatus.notFound).json({ message: 'Такой страницы не существует' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
