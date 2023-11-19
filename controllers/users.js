const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CastError } = require('mongoose').Error;
const UserModel = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getUsers = (req, res, next) => {
  UserModel
    .find({})
    .then((users) => {
      res.send(users);
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
    .then(() => {
      res.status(201).send({
        name, about, avatar, email,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Введены некорректные данные. Ошибка'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Ошибка: Пользователь существует'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  UserModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неверные данные для авторизации'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError('Неверные данные для авторизации'));
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
  const { _id } = req.user;
  UserModel.findById(_id)
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден. Ошибка'));
      }
      if (err instanceof CastError) {
        return next(new BadRequestError('Введены некорректные данные. Ошибка'));
      }
      return next(err);
    });
};

const getUserById = (req, res, next) => {
  UserModel
    .findById(req.params.id)
    .orFail().then((user) => {
      res.send(user);
    }).catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Введены некорректные данные. Ошибка'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError(`Такой карточки с id ${req.params.id} нет`));
      }
      return next(err);
    });
};

const editUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail().then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Введены некорректные данные. Ошибка'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден. Ошибка'));
      }
      return next(err);
    });
};

const editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Введены некорректные данные. Ошибка'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден. Ошибка'));
      }
      return next(err);
    });
};

module.exports = {
  getUsers, createUser, getUserById, editUserInfo, editAvatar, login, getUserInfo,
};
