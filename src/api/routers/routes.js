const express = require('express');
const router = express.Router();

router.use("/articles", require("./api/articles.routes"));

module.exports = router;