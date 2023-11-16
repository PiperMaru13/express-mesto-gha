const CardModel = require('../models/card');
const httpStatus = require('../utils/errorstatus');

const getCards = (req, res) => {
  CardModel.find()
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(httpStatus.internalServerError).send({
        message: 'Ошибка по умолчанию.',
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  CardModel.create({ name, link, owner }).then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(httpStatus.badRequest).send({
          message: 'Введены некорректные данные. Ошибка:',
        });
      }
      return res.status(httpStatus.internalServerError).send({
        message: 'Ошибка по умолчанию.',
      });
    });
};

const deleteCard = (req, res) => {
  CardModel.findOneAndDelete({ _id: req.params.id })
    .then((card) => {
      if (!card) {
        return res.status(httpStatus.notFound).send({
          message: `Карточка с id ${req.params.id} не найдена.`,
        });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(httpStatus.badRequest).send({
          message: 'Введены некорректные данные. Ошибка:',
        });
      }
      return res.status(httpStatus.internalServerError).send({
        message: 'Ошибка.',
      });
    });
};

const likeCard = (req, res) => CardModel.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).orFail().then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(httpStatus.badRequest).send({
        message: 'Введены некорректные данные. Ошибка:',
      });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res.status(httpStatus.notFound).send({
        message: `Карточка с id ${req.params.id} не найдена. Ошибка:`,
      });
    }
    return res.status(httpStatus.internalServerError).send({
      message: 'Ошибка по умолчанию.',
    });
  });

const dislikeCard = (req, res) => CardModel.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).orFail().then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(httpStatus.badRequest).send({
        message: 'Введены некорректные данные. Ошибка:',
      });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res.status(httpStatus.notFound).send({
        message: `Карточка с id ${req.params.id} не найдена. Ошибка:`,
      });
    }
    return res.status(httpStatus.internalServerError).send({
      message: 'Ошибка по умолчанию.',
    });
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
