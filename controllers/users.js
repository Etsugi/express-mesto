const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send({"message": "Ошибка на сервере"}));
};

const getUserById = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .orFail(() => {
      const err = new Error('Пользователь не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((data) => res.status(200).send(data))
    .catch(err => {
      if(err.statusCode === 404) {
        return res.status(404).send({"message": err.message});
      }
      else if (err.kind === 'ObjectId') {
        return res.status(400).send({"message": "Данные невалидны"});
      }
      res.status(500).send({"message": "Ошибка на сервере"});
    })
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(data => res.status(200).send(data))
    .catch(err => {
      if (err._message === 'user validation failed') {
        return res.status(400).send({"message": "Переданы некорректные данные"});
      }
      res.status(500).send({"message": "Ошибка на сервере"});
    })
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
    .then((data) => res.status(200).send(data))
    .catch(err => {
      if (err._message === 'Validation failed') {
        return res.status(400).send({"message": "Переданы некорректные данные"});
      }
      res.status(500).send({"message": err});
    })
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
    .then((data) => res.status(200).send(data))
    .catch(err => {
      if (err._message === 'Validation failed') {
        return res.status(400).send({"message": "Переданы некорректные данные"});
      }
      res.status(500).send({"message": "Ошибка на сервере"});
    })
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar
}
