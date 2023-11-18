const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const httpStatus = require('../utils/errorstatus');

const getUsers = (req, res, next) => {
  UserModel
    .find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((next));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => UserModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(httpStatus.Conflict).send({
          message: 'Ошибка: Пользователь существует',
        });
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  UserModel.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(httpStatus.Unauthorized).send({
          message: 'Неверные данные для авторизации',
        });
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res.status(httpStatus.Unauthorized).send({
            message: 'Неверные данные для авторизации',
          });
        }
        return user;
      });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '655567d1682364adfaca9652', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 1000000,
        httpOnly: true,
        sameSite: true,
      }).send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  UserModel.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};

const getUserById = (req, res, next) => {
  UserModel
    .findById(req.params.id)
    .orFail().then((user) => {
      res.status(200).send(user);
    }).catch((err) => {
      if (err.name === 'CastError') {
        return res.status(httpStatus.badRequest).send({
          message: 'Введены некорректные данные. Ошибка:',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(httpStatus.notFound).send({
          message: `Пользователь c ${req.params.id} не найден. Ошибка:`,
        });
      }
      return next(err);
    });
};

const editUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail().then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(httpStatus.badRequest).send({
          message: 'Введены некорректные данные. Ошибка:',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(httpStatus.notFound).send({
          message: 'Пользователь не найден. Ошибка:',
        });
      }
      return next(err);
    });
};

const editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(httpStatus.badRequest).send({
          message: 'Введены некорректные данные. Ошибка:',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(httpStatus.notFound).send({
          message: 'Пользователь не найден. Ошибка:',
        });
      }
      return next(err);
    });
};

module.exports = {
  getUsers, createUser, getUserById, editUserInfo, editAvatar, login, getUserInfo,
};
