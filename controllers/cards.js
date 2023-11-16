const CardModel = require('../models/card');

const getCards = (req, res) => {
  CardModel.find()
    .then((cards) => {
      if (cards.length === 0) {
        res.status(400).send({
          message: 'Введены некорректные данные',
        });
      } else {
        res.status(200).send(cards);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Ошибка по умолчанию. ${err.message}`,
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  CardModel.create({ name, link, owner }).then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({
          message: `Введены некорректные данные. Ошибка: ${err.message}`
        });
      }
      return res.status(500).send({
        message: `Ошибка по умолчанию. ${err.message}`
      });
    });
};

const deleteCard = (req, res) => {
  CardModel.findByIdAndDelete(req.params.id)
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFound') {
        res.status(404).send({
          message: `Карточка с id ${req.params.id} не найдена. Ошибка: ${err.message}`
        });
      }
      return res.status(500).send({
        message: `Ошибка по умолчанию. ${err.message}`
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
      res.status(400).send({
        message: `Введены некорректные данные. Ошибка: ${err.message}`
      });
    }
    if (err.name === 'DocumentNotFoundError') {
      res.status(404).send({
        message: `Карточка с id ${req.params.id} не найдена. Ошибка: ${err.message}`
      });
    }
    return res.status(500).send({
      message: `Ошибка по умолчанию. ${err.message}`
    });
  });

const dislikeCard = (req, res) => CardModel.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).orFail().then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({
        message: `Введены некорректные данные. Ошибка: ${err.message}`
      });
    }
    if (err.name === 'DocumentNotFoundError') {
      res.status(404).send({
        message: `Карточка с id ${req.params.id} не найдена. Ошибка: ${err.message}`
      });
    }
    return res.status(500).send({
      message: `Ошибка по умолчанию. ${err.message}`
    });
  });

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
