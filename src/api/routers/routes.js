const express = require('express');
//const usersRouter = require('./api/user.routes');

const router = express.Router();

router.use('/users', require('./api/user.routes'));
//router.use('/articles', require('./api.routes/articles.routes'));

module.exports = router;
