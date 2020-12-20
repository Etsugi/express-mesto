const router = require('express').Router();

const { getCards, postCards, deleteCard, likeCard, disLikeCard } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', postCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', disLikeCard);

module.exports = router;