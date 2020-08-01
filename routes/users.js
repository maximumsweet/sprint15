const usersRouter = require('express').Router();

const { getUser, getUsers } = require('../controllers/users');
const { userIdCheck } = require('../middlewares/validation');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', userIdCheck, getUser);

module.exports = usersRouter;
