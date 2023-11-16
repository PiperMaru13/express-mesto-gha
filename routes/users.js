const usersRouter = require('express').Router();
const {
  getUsers, createUser, getUserById, editUserInfo, editAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.post('/', createUser);
usersRouter.get('/:id', getUserById);
usersRouter.patch('/me', editUserInfo);
usersRouter.patch('/me/avatar', editAvatar);

module.exports = usersRouter;
