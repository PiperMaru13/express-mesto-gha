const usersRouter = require('express').Router();
const {
  getUsers, getUserById, editUserInfo, editAvatar, getUserInfo,
} = require('../controllers/users');
const { userIdValidator, userValidator, avatarValidator } = require('../middlewares/validators');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', userIdValidator, getUserById);
usersRouter.get('/me', getUserInfo);
usersRouter.patch('/me', userValidator, editUserInfo);
usersRouter.patch('/me/avatar', avatarValidator, editAvatar);

module.exports = usersRouter;
