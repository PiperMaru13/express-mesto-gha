const UserModel = require('../models/user');
const httpStatus = require('../utils/errorstatus');

const getUsers = (req, res) => {
  UserModel
    .find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(httpStatus.internalServerError).send({
        message: 'Ошибка по умолчанию.',
      });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  UserModel
    .create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(httpStatus.badRequest).send({
          message: 'Введены некорректные данные. Ошибка:',
        });
      }
      return res.status(httpStatus.internalServerError).send({
        message: 'Ошибка по умолчанию.',
      });
    });
};

const getUserById = (req, res) => {
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
      return res.status(httpStatus.internalServerError).send({ message: 'Ошибка по умолчанию.' });
    });
};

const editUserInfo = (req, res) => {
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
      return res.status(httpStatus.internalServerError).send({
        message: 'Ошибка по умолчанию.',
      });
    });
};

const editAvatar = (req, res) => {
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
      return res.status(httpStatus.internalServerError).send({
        message: 'Ошибка по умолчанию.',
      });
    });
};

module.exports = {
  getUsers, createUser, getUserById, editUserInfo, editAvatar,
};
