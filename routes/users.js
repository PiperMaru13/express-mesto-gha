const usersRouter = require('express').Router();
const bodyParser = require('body-parser');
const UserModel = require('../models/user');
const { getUsers, createUser, getUserById, editUserInfo, editAvatar } = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.post('/', createUser);
usersRouter.get('/:id', getUserById);
usersRouter.patch('/me', editUserInfo);
usersRouter.patch('/me/avatar', editAvatar);

usersRouter.use(bodyParser.json());

module.exports = usersRouter;
