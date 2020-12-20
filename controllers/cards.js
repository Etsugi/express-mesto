const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send({"message": "Ошибка на сервере"}));
};

const postCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then(data => res.status(200).send(data))
    .catch(err => {
      if (err._message === 'card validation failed') {
        return res.status(400).send({"message": "Переданы некорректные данные"});
      }
      res.status(500).send({"message": "Ошибка на сервере"});
    })
};

const deleteCard = (req, res) => {
  const cardId = req.params.cardId;
  Card.findByIdAndRemove(cardId)
    .then(card => res.send(card))
    .catch(err => res.status(500).send({"message": "Ошибка на сервере"}));
};

const likeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
  .then(card => res.send(card))
  .catch(err => res.status(500).send({"message": "Ошибка на сервере"}));
};

const disLikeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
  .then(card => res.send(card))
  .catch(err => res.status(500).send({"message": "Ошибка на сервере"}));
};

module.exports = {
  getCards,
  postCards,
  deleteCard,
  likeCard,
  disLikeCard
}