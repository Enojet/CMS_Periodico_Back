const express = require('express');
const router = express.Router();
const { addUser, getUsers } = require('../controllers/user.controller');

router.post('/add', addUser);
router.get('/listusers', getUsers);

module.exports = router;
