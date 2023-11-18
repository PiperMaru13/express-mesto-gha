const usersRouter = require('express').Router();
const {
  getUsers, getUserById, editUserInfo, editAvatar, getUserInfo,
} = require('../controllers/users');
const { userIdValidator, userValidator, avatarValidator } = require('../middlewares/validators');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUserInfo);
usersRouter.get('/:id', userIdValidator, getUserById);
usersRouter.patch('/me', userValidator, editUserInfo);
usersRouter.patch('/me/avatar', avatarValidator, editAvatar);

module.exports = usersRouter;
