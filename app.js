const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routerCards = require('./routes/cards');
const routerUsers = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/', routerCards);
app.use('/', routerUsers);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Сервис запущен на ${PORT} порту`);
});
