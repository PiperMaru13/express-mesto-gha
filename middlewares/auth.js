const jwt = require('jsonwebtoken');
const httpStatus = require('../utils/errorstatus');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(httpStatus.Unauthorized).send({
      message: 'Неверные данные для авторизации',
    });
  }
  let payload;
  try {
    payload = jwt.verify(token, '655567d1682364adfaca9652');
  } catch (err) {
    return res.status(httpStatus.Unauthorized).send({
      message: 'Неверные данные для авторизации',
    });
  }
  req.user = payload;
  return next();
};
