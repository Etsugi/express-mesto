const router = require('express').Router();
const path = require('path');
const fsPromises = require('fs').promises;
const pathToFile = path.join(__dirname, '..', 'data', 'users.json');

const getUsers = (req, res) => {
  return getFiles(pathToFile)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send({"message": "Произошла ошибка при загрузке данных"}));
};

const getFiles = (pathToFile) => {
  return fsPromises.readFile(pathToFile, {encoding: 'utf-8'})
    .then(data => JSON.parse(data))
    .catch();
}

const getProfile = (req, res) => {
  return getFiles(pathToFile)
    .then(users => users.find(users => users._id === req.params.id))
    .then((user) => {
      if(!user) {
        return res.status(404).send({"message": "Нет пользователя с таким id"});
      }
      return res.status(200).send(user);
    })
    .catch(err => res.status(500).send({"message": "Произошла ошибка при загрузке данных"}));
};

router.get('/users', getUsers);
router.get('/users/:id', getProfile);

module.exports = router;
