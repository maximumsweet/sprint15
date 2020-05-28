const usersRouter = require('express').Router();

const { getUser, getUsers } = require('../controllers/users');

usersRouter.get('/users/:id', getUser);
usersRouter.get('/users', getUsers);

module.exports = usersRouter;
