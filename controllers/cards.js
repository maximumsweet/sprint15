const mongoose = require('mongoose');

const cardModel = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const { ObjectId } = mongoose.Types;

module.exports.getCards = (req, res, next) => {
  cardModel.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  cardModel.create({ name, link, owner: _id })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Ошибка валидации');
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  if (!ObjectId.isValid(cardId)) {
    throw new BadRequestError('Невалидный id');
  }

  cardModel.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с id ${cardId} не найдена`);
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Невозможно удалить чужую карточку');
      } else {
        cardModel.findByIdAndRemove(cardId)
          .then(() => res.status(200).send({ data: card }))
          .catch(next);
      }
    })
    .catch(next);
};
