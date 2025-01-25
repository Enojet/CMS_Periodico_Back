
const express = require('express');
const router = express.Router();
const {publishedArticle,publishedSection, createArticle, allDraftArticles, detailArticleById, updateArticleById, updateForReview, asignEditor, allArticleEditor, detailArticleEditor, articleToBePublish, editorEdition, returnToDraft}  = require('../../controllers/articles.controller');
//Rutas publicadas general y por artículos
router.get('/publisedhArticle', publishedArticle);//todos los articulos publicados
router.get('/publisedhArticleBySection', publishedSection);//todos los articulos publicados según la sección


//Rutas definidas para el redactor
router.post('/create', createArticle);
router.get('/draftArticles', allDraftArticles);//se muestran todos los articulos en borrador
router.get('/articleById', detailArticleById);// se muestra el articulo seleccionado
router.put('/draft/:id', updateArticleById);//Editar articulos según  el Id
router.put('/review/:id', updateForReview);//Editar el status a review
//COMPROBAR RUTA
router.put('/asignEditor/:id', asignEditor);//Asignar un editor

//Rutas definidas para el editor
router.get('/allArticleEditor/:idEditor',allArticleEditor );//Todos los articulos asignados al editos para su revisión
router.get('/articleEditor/:id/:editorId', detailArticleEditor);//seleccionar articulo concreto del editor
router.put('/returnDraft/:id', returnToDraft);//Devolver a borrador
router.put('/edit/:id', editorEdition);//Modificaciones del editor
router.put('/publish/:id', articleToBePublish);//Editar articulos según  el Id
module.exports = router;
