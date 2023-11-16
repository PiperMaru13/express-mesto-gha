const cardsRouter = require('express').Router();
const bodyParser = require('body-parser');
const CardModel = require('../models/card');
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:id', deleteCard);
cardsRouter.put('/:id/likes', likeCard);
cardsRouter.delete('/:id/likes', dislikeCard);

cardsRouter.use(bodyParser.json());
module.exports = cardsRouter;
