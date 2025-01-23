
const express = require('express');
const router = express.Router();



const {add,updateArticles}  = require('../../controllers/articles.controller');

//Define la ruta para crear artículos
router.post('/add', add);
router.put("/update/:id", updateArticles);//Editar articulos según 

module.exports = router;
