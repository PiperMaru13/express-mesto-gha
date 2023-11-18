const CardModel = require('../models/card');
const httpStatus = require('../utils/errorstatus');

const getCards = (req, res, next) => {
  CardModel.find()
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  CardModel.create({ name, link, owner }).then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(httpStatus.badRequest).send({
          message: 'Введены некорректные данные. Ошибка:',
        });
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  CardModel.findById({ _id: req.params.id })
    .then((card) => {
      if (!card) {
        return res.status(httpStatus.notFound).send({
          message: 'Такой карточки нет',
        });
      }
      if (req.user._id !== card.owner.toString()) {
        return res.status(httpStatus.Forbidden).send({
          message: 'Нет прав на удаление!',
        });
      }
      return CardModel.findByIdAndDelete(req.params.id);
    })
    .then(() => {
      res.send({ message: 'Успешно!' });
    })
    .catch(next);
};

const likeCard = (req, res, next) => CardModel.findByIdAndUpdate(
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
    return next(err);
  });

const dislikeCard = (req, res, next) => CardModel.findByIdAndUpdate(
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
    return next(err);
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
