const Articles = require("../models/articles.model")

const publishedArticle=async(req,res)=>{
    try {
        const articles = await Articles.find({ status: 'publish' })
        res.json(articles);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};
const publishedSection = async (req, res) => {
    try {
      // Obtén la sección desde los query params
      const section = req.query.section;
  
      if (!section) {
        return res.status(400).json({ message: "Sección no especificada." });
      }
  
      // Busca artículos que coincidan con la sección y estén en estado "publish"
      const articleSection = await Articles.find({ 
        section: section, 
        status: 'publish' 
      });
  
      // Responde con los artículos encontrados
      res.json(articleSection);
    } catch (error) {
      // Manejo de errores
      res.status(500).json({ message: error.message });
    }
};
const createArticle = async (req, res) => {

    // Crear un nuevo artículo usando los datos del body de la solicitud
    const newArticles = new Articles(req.body)
    // Guardar el nuevo artículo en la base de datos
    const createdArticles = await newArticles.save()
    // Devolver el artículo creado como respuesta JSON
    return res.json(createdArticles)
    

};
const allDraftArticles=async(req,res)=>{
    try {
        const articles = await Articles.find({ status: 'draft' })
        res.json(articles);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}
const detailArticleById = async (req,res) => {
   try{
    //obetenr el id desde query params
     const {id}=req.query;
     if (!id) {
        return res.status(400).json({ message: "El ID es requerido." });
      }
     const articleId = await Articles.find({ 
        _id: id, 
        status: 'draft' 
      });
      if(articleId.length===0){
        return res.status(404).json({message: "Artículo no encontrado o no está en estado 'draft'."});
      }
     // Responde con los artículos encontrados
      res.json(articleId);
    } catch (error) {
      // Manejo de errores
      res.status(500).json({ message: error.message });
    }
}
const updateArticleById = async (req, res) => {
    const id=req.params.id;
    const article=req.body;
    try {
        const newArticle = await Articles.findByIdAndUpdate(id, article,{new:true});
        if (newArticle===null) {
            return res.status(404).json({ msg: 'Artículo no encontrado' });
          }
         // Verificar si el artículo puede ser editado
        if (newArticle.status === 'review' || newArticle.status === 'publish') {
            return res.status(403).json({ 
             message: 'No se puede editar un artículo en revisión, ni publicado' 
});
          }
        return res.status(200).json({msg:'Articulo actualizado correctamente',newArticle});
        
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}
const updateForReview=async(req, res) =>{
    try {
        const updateStatus = await Articles.findById(req.params.id);
        
        if (!updateStatus) {
          return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        if (updateStatus.status !== 'draft') {
          return res.status(400).json({ 
            message: 'Solo se pueden enviar a revisión artículos en borrador' 
          });
        }
        updateStatus.status = 'review';
        await updateStatus.save();
    
        res.json(updateStatus);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}
const asignEditor=async(req, res) =>{
    try {
        const { editorId } = req.body;
        const article = await Articles.findById(req.params.id);
        
        if (!article) {
          return res.status(404).json({ message: 'Artículo no encontrado' });
        }
          if (article.status !== 'review') {
          return res.status(400).json({ 
            message: 'Solo se pueden asignar artículos en revisión' 
          });
        }
         const editor = await User.findById(editorId);
        if (!editor || editor.role !== 'editor') {
          return res.status(400).json({ message: 'Editor no válido' });
        };
        article.editor = editorId;
        await article.save();
        res.json(article);
      } catch (error) {
        res.status(400).json({ message: error.message });
      };
};
const allArticleEditor=async(req,res)=>{
    try{
        //obetenr el id desde query params
         const editorId=req.params.idEditor;
         if (!editorId) {
            return res.status(400).json({ message: "El ID es requerido." });
          }
         const articles = await Articles.find({ 
            editorId: editorId, 
            status: 'review' 
          });
          if(articles.length===0){
            return res.status(404).json({message: "No tiene articulos asignados'."});
          }
         // Responde con los artículos encontrados
          res.json(articles);
        } catch (error) {
          // Manejo de errores
          res.status(500).json({ message: error.message });
        }

};
const detailArticleEditor=async(req,res)=>{
    try{
        //obetenr el id desde query params
         const {id,editorId}=req.params;
         //const editorId=req.params.editorId;
         
         if (!id ) {
            return res.status(400).json({ message: "El ID del articulo es requerido." });
          }
          if ( !editorId) {
            return res.status(400).json({ message: "El ID  del editor es requerido." });
          }
         const article = await Articles.find({ 
            _id: id, 
            status: 'review', 
            editorId:editorId
          });
          if(!article){
            return res.status(404).json({message: "Artículo no encontrado o no está en estado 'review'."});
          }
         // Responde con los artículos encontrados
          res.json(article);
        } catch (error) {
          // Manejo de errores
          res.status(500).json({ message: error.message });
        }
    };

const editorEdition=async(req,res)=>{
    const id=req.params.id;
    const article=req.body;
    try {
        const newArticle = await Articles.findByIdAndUpdate(id, article,{new:true});
        if (newArticle===null) {
            return res.status(404).json({ msg: 'Artículo no encontrado' });
          }
         // Verificar si el artículo puede ser editado
        if (newArticle.status === 'draft' || newArticle.status === 'publish') {
            return res.status(403).json({ 
             message: 'No se puede editar un artículo en borrador, ni publicado' 
});
          }
        return res.status(200).json({msg:'Articulo actualizado correctamente',newArticle});
        
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};
const returnToDraft=async(req,res)=>{
    try {
        const updateStatus = await Articles.findById(req.params.id);
        
        if (!updateStatus) {
          return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        if (updateStatus.status !== 'review') {
          return res.status(400).json({ 
            message: 'Solo se pueden enviar a borrador artículos en revisión' 
          });
        }
        updateStatus.status = 'draft';
        await updateStatus.save();
    
        res.json(updateStatus);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}; 
const articleToBePublish=async(req,res)=>{
    try {
        const updateStatus = await Articles.findById(req.params.id);
        
        if (!updateStatus) {
          return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        if (updateStatus.status !== 'review') {
          return res.status(400).json({ 
            message: 'Solo se pueden enviar a publicar artículos en revisión' 
          });
        }
        updateStatus.status = 'publish';
        await updateStatus.save();
    
        res.json(updateStatus);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }

};


module.exports =  {publishedArticle, publishedSection, createArticle, allDraftArticles, detailArticleById, updateArticleById, updateForReview, asignEditor, allArticleEditor, detailArticleEditor, articleToBePublish, editorEdition, returnToDraft }