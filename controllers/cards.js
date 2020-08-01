const cardModel = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  cardModel.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  cardModel.create({ name, link, owner: _id })
    .then((card) => res.status(200).send({ data: card }))
    .catch(next);
};

module.exports.getCard = (req, res, next) => cardModel.findById({
  _id: req.params.cardId,
})
  .then((card) => {
    if (!card) {
      throw new NotFoundError(`Карточка с id ${req.params.cardId} не найдена`);
    }
    next();
  })
  .catch(next);

module.exports.deleteCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .then((cardId) => {
      if (cardId.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Невозможно удалить чужую карточку');
      }
      cardModel.remove(cardId)
        .then(() => res.status(200).send({ data: cardId }))
        .catch(next);
    })
    .catch(next);
};
