const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then(data => res.send(data))
    .catch(() => res.status(500).send({message: 'Ошибка на сервере'}));
};

const getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => {
      const err = new Error('Пользователь не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((data) => res.send(data))
    .catch(err => {
      if (err.statusCode === 404) {
        return res.status(404).send({message: err.message});
      }
      if (err.kind === 'ObjectId') {
        return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({message: 'Ошибка на сервере'});
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(data => res.send(data))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({message: 'Ошибка на сервере'});
    });
};

const updateUser = (req, res) => {
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
        return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({message: 'Ошибка на сервере'});
    });
};

const updateUserAvatar = (req, res) => {
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
        return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({message: 'Ошибка на сервере'});
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar
};
