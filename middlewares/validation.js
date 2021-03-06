/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const NotValid = require('../errors/bad-request-error');

const createUserCheck = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
    avatar: Joi
      .string()
      .required()
      .regex(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/m)
      .error(new NotValid('Поле avatar должно содержать ссылку')),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const createCardCheck = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi
      .string()
      .required()
      .regex(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/m)
      .error(new NotValid('Поле link должно содержать ссылку')),
  }),
});

const loginCheck = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const cardIdCheck = celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId(),
  }),
});

const userIdCheck = celebrate({
  params: Joi.object().keys({
    id: Joi.objectId(),
  }),
});

module.exports = {
  createUserCheck, createCardCheck, loginCheck, cardIdCheck, userIdCheck,
};
