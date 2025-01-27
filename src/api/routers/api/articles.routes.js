
const express = require('express');
const router = express.Router();
const {allArticle, createArticle, detailArticleById, updateArticleById, updateStatus , asignEditor}  = require('../../controllers/articles.controller');
//Ruta para obetener todos los articulos y un articulo concreto por su id 
router.get('/allArticle', allArticle);//todos los articulos publicados
router.get('/articleById', detailArticleById);// se muestra el articulo seleccionado
//Ruta para crear articulo
router.post('/create', createArticle);
//Ruta para modificación del articulo:contenido,status, asignar editor
router.put('/draft/:id', updateArticleById);//Editar articulos según  el Id
router.put('/status/:id', updateStatus);//Editar el status a review
//COMPROBAR RUTA
router.put('/asignEditor/:id', asignEditor);//Asignar un editor

module.exports = router;
