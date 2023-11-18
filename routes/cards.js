const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { cardValidator, cardIdValidator } = require('../middlewares/validators');

cardsRouter.post('/', cardValidator, createCard);
cardsRouter.get('/', getCards);
cardsRouter.delete('/:id', cardIdValidator, deleteCard);
cardsRouter.put('/:id/likes', cardIdValidator, likeCard);
cardsRouter.delete('/:id/likes', cardIdValidator, dislikeCard);

module.exports = cardsRouter;
