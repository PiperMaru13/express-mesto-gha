const CardModel = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../utils/errorstatus');

const getCards = (req, res, next) => {
  CardModel.find()
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  CardModel.create({ name, link, owner }).then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные. Ошибка'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;
  CardModel.findById({ cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет');
      }
      if (userId !== card.owner.toString()) {
        throw new ForbiddenError('Нет прав на удаление!');
      }
      return CardModel.findByIdAndDelete(req.params.id);
    })
    .then(() => {
      res.send({ message: 'Успешно!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные. Ошибка'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => CardModel.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).orFail().then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Введены некорректные данные. Ошибка'));
    }
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError(`Такой карточки с id ${req.params.id} нет`));
    }
    return next(err);
  });

const dislikeCard = (req, res, next) => CardModel.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).orFail().then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Введены некорректные данные. Ошибка'));
    }
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError(`Такой карточки с id ${req.params.id} нет`));
    }
    return next(err);
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
