
const express = require('express');
const router = express.Router();
//const {authMiddleware}=require('../../../utils/middleware')
const {allPublishArticles,
     articlesByAuthor, 
     articlesByEditor, 
     createArticle, 
     detailArticleById, 
     updateArticleById, 
     updateStatus ,
    asignEditor,
    imageUpload
}  = require('../../controllers/articles.controller');
const {authMiddleware}=require('../../../utils/middleware');
const upload=require("../../../utils/upload.file");
//Ruta para obetener todos los articulos y un articulo concreto por su id 
router.get('/publishArticles', allPublishArticles);//todos los articulos publicados ordenados
//WRITER
router.post('/create', authMiddleware, createArticle);
router.get('/getArticlesByAuthor/:idAutor', authMiddleware, articlesByAuthor);//muestra todos los artículos del id de ese autor

router.get('/getArticlesByEditor/:idEditor', authMiddleware, articlesByEditor);//-todos los articulos que tengan el id del editor
router.get('/articleById/:IdA', authMiddleware, detailArticleById);// se muestra el articulo seleccionado (cambiar /:id)
//Ruta para modificación del articulo:contenido,status, asignar editor
router.put('/content/:id', authMiddleware, updateArticleById);//Editar contenido según  el Id
router.put('/status/:id/:status', authMiddleware, updateStatus);//Editar el status revisable, draft, publicar
//COMPROBAR RUTA
router.put('/asignEditor/:idA/:idE', authMiddleware, asignEditor);//Asignar un editor

router.post('/uploadFile',upload.single("image"), imageUpload);



//Ruta para crear articulo



module.exports = router;
