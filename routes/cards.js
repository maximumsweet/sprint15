const cardRouter = require('express').Router();

const { createCard, getCards, deleteCard } = require('../controllers/cards');
const { createCardCheck, cardIdCheck } = require('../middlewares/validation');

cardRouter.get('/cards', getCards);

cardRouter.post('/cards', createCardCheck, createCard);

cardRouter.delete('/cards/:cardId', cardIdCheck, deleteCard);

module.exports = cardRouter;
