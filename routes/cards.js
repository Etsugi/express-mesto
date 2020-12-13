const router = require('express').Router();
const path = require('path');
const fsPromises = require('fs').promises;
const pathToFile = path.join(__dirname, '..', 'data', 'cards.json');

const getCards = (req, res) => {
  return getFiles(pathToFile)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send({"message": "Произошла ошибка при загрузке данных"}));
};

const getFiles = (pathToFile) => {
  return fsPromises.readFile(pathToFile, {encoding: 'utf-8'})
    .then(data => JSON.parse(data))
    .catch();
}


router.get('/cards', getCards);


module.exports = router;