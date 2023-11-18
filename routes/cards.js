const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { cardValidator, cardIdValidator } = require('../middlewares/validators');

cardsRouter.get('/', getCards);
cardsRouter.post('/', cardValidator, createCard);
cardsRouter.delete('/:id', cardIdValidator, deleteCard);
cardsRouter.put('/:id/likes', cardIdValidator, likeCard);
cardsRouter.delete('/:id/likes', cardIdValidator, dislikeCard);

module.exports = cardsRouter;
