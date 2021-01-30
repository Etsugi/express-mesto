const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictingRequestError = require('../errors/conflicting-request-err');
const UnauthorizeError = require('../errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then(data => res.send(data))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => {
      const err = 404;
      throw err;
    })
    .then(data => res.send(data))
    .catch(err => {
      if (err === 404) {
        throw new NotFoundError('Пользователь не найден');
      }
      if (err.kind === 'ObjectId') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar
    }))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
        email: user.email
      });
    })
    .catch(err => {
      if (err.code === 11000) {
        throw new ConflictingRequestError('Пользователь с таким email уже существует');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
      }
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, {
    name,
    about
  }, {
    runValidators: true,
    new: true
  })
    .then((data) => res.send(data))
    .catch(err => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, {
    avatar
  }, {
    runValidators: true,
    new: true
  })
    .then((data) => res.send(data))
    .catch(err => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizeError('Некорректно заполнено одно из полей');
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  getUserInfo,
  updateUser,
  updateUserAvatar,
  login
};
