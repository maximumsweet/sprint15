/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const { ObjectId } = mongoose.Types;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 604800,
        httpOnly: true,
        sameSite: true,
        secure: true,
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  userModel.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    throw new BadRequestError({ message: 'Невалидный id' });
  }

  userModel.findById({ _id: id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: 'Нет пользователя с таким id' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (password.length < 8) {
    throw new BadRequestError({ message: 'Пароль должен содержать как минимум 6 символов' });
  }

  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch((err) => ((err.name === 'ValidationError') ? new BadRequestError('Ошибка валидации') : next(err)));
};
