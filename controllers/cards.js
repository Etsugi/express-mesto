const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['likes', 'owner'])
    .then(data => res.send(data))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then(data => res.send(data))
    .catch(err => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const id = req.user._id;

  Card.findById(cardId)
    .orFail(() => {
      const err = 404;
      throw err;
    })
    .then((card) => {
      if (card.owner.toString() !== id) {
        throw new ForbiddenError('Нет прав на удаление');
      } else {
        Card.findByIdAndRemove(cardId)
          .populate(['likes', 'owner'])
          .then(data => res.send(data))
          .catch(next);
      }
    })
    .catch(err => {
      if (err === 404) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (err.kind === 'ObjectId') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      const err = 404;
      throw err;
    })
    .populate(['likes', 'owner'])
    .then(card => res.send(card))
    .catch(err => {
      if (err === 404) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (err.kind === 'ObjectId') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const disLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      const err = 404;
      throw err;
    })
    .populate(['likes', 'owner'])
    .then(card => res.send(card))
    .catch(err => {
      if (err === 404) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (err.kind === 'ObjectId') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard
};
