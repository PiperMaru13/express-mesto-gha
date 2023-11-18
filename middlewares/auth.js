const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError('Ошибка токена!'));
  }
  let payload;
  try {
    payload = jwt.verify(token, '655567d1682364adfaca9652');
  } catch (err) {
    return next(new UnauthorizedError('Ошибка токена!'));
  }
  req.user = payload;
  return next();
};
