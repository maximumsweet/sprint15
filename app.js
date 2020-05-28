/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const routerCards = require('./routes/cards');
const routerUsers = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { createUserCheck, loginCheck } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.use(requestLogger);

app.post('/signin', loginCheck, login);
app.post('/signup', createUserCheck, createUser);

app.use(auth);
app.use('/', routerCards);
app.use('/', routerUsers);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`Сервис запущен на ${PORT} порту`);
});
