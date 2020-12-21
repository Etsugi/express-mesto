const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .populate(['likes', 'owner'])
    .then(data => res.send(data))
    .catch(() => res.status(500).send({message: 'Ошибка на сервере'}));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then(data => res.send(data))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({message: 'Ошибка на сервере'});
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const err = new Error('Карточка не найдена');
      err.statusCode = 404;
      throw err;
    })
    .populate(['likes', 'owner'])
    .then(data => res.send(data))
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

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      const err = new Error('Карточка не найдена');
      err.statusCode = 404;
      throw err;
    })
    .populate(['likes', 'owner'])
    .then(card => res.send(card))
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

const disLikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      const err = new Error('Карточка не найдена');
      err.statusCode = 404;
      throw err;
    })
    .populate(['likes', 'owner'])
    .then(card => res.send(card))
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

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard
};
