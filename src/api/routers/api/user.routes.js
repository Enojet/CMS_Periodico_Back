const express = require('express');
const router = express.Router();
const { register, login, getAllEditor } = require('../../controllers/user.controller');

router.post('/register', register);

router.post('/login', login);

router.get('/allEditor', getAllEditor);

module.exports = router;