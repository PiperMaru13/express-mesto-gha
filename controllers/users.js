const UserModel = require('../models/user');

const getUsers = (req, res) => {
  UserModel
    .find().orFail()
    .then((users) => {
      if (users.length === 0) {
        res.status(400).send({
          message: 'Введены некорректные данные',
        });
      } else {
        res.status(200).send(users);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Ошибка по умолчанию. ${err.message}`,
      });
    });
};

const createUser = (req, res) => {
  UserModel
    .create({ ...req.body })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({
          message: `Введены некорректные данные. Ошибка: ${err.message}`
        });
      }
      return res.status(500).send({
        message: `Ошибка по умолчанию. ${err.message}`
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
        res.status(400).send({
          message: `Введены некорректные данные. Ошибка: ${err.message}`
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({
          message: `Пользователь c ${req.params.id} не найден. Ошибка: ${err.message}`
        });
      }
      res.status(500).send({ message: `Ошибка по умолчанию. ${err.message}` });
    });
};

const editUserInfo = (req, res) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail().then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({
          message: `Введены некорректные данные. Ошибка: ${err.message}`
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({
          message: `Пользователь не найден. Ошибка: ${err.message}`
        });
      }
      return res.status(500).send({
        message: `Ошибка по умолчанию. ${err.message}`
      });
    });
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail().then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({
          message: `Введены некорректные данные. Ошибка: ${err.message}`
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({
          message: `Пользователь не найден. Ошибка: ${err.message}`
        });
      }
      return res.status(500).send({
        message: `Ошибка по умолчанию. ${err.message}`
      });
    });
};

module.exports = { getUsers, createUser, getUserById, editUserInfo, editAvatar };
