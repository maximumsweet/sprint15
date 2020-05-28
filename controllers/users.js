/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user');
const superSecretKey = require('../secret');

const { ObjectId } = mongoose.Types;

module.exports.getUsers = (req, res) => {
  userModel.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).send({ message: 'Невалидный id' });
    return;
  }

  userModel.findById({ _id: id })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (password.length < 6) {
    return res.status(400).send({ message: 'Пароль должен содержать как минимум 6 символов' });
  }

  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch((err) => ((err.name === 'ValidationError') ? res.status(400).send({ message: err.message }) : res.status(409).send({ message: err.message })));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, superSecretKey, { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 604800,
        httpOnly: true,
        sameSite: true,
        secure: true,
      });
      res.send({ token });
    })
    .catch((err) => res.status(401).send({ message: err.message }));
};
