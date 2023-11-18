const jwt = require('jsonwebtoken');
// const httpStatus = require('../utils/errorstatus');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new Error(`'Ошибка токена'${token}`));
  }
  let payload;
  try {
    payload = jwt.verify(token, '655567d1682364adfaca9652');
  } catch (err) {
    return next(new Error('Ошибка токена'));
  }
  req.user = payload;
  return next();
};
