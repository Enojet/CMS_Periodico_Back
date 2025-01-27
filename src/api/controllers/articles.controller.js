const Articles = require("../models/articles.model")

const allArticle=async(req,res)=>{
    try {
        const articles = await Articles.find({ })
        res.json(articles);
      } catch (error) {
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
        if ( newArticle.status === 'publish') {
            return res.status(403).json({ 
             message: 'No se puede editar un artículo publicado' 
});
          }
        return res.status(200).json({msg:'Articulo actualizado correctamente',newArticle});
        
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}
const updateStatus = async (req, res) => {
  try {
    const article = await Articles.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    // Solo el writer puede cambiar el status de 'draft' a 'review'
    if (article.status === 'draft') {
      if(req.body.status === 'publish'){      
        return res.status(400).json({ message: 'El estado solo puede ser pasar de  "draft" a "review".' })
      }else{ req.body.status==='review';
        article.status='review';
        await article.save();
        return res.json(article);
      }};
    // El editor puede cambiar el estado de 'review' a 'draft' o 'publish'
    if (article.status === 'review' ) {
      if (req.body.status && ['draft', 'publish'].includes(req.body.status)) {
        article.status = req.body.status; // Asume que el nuevo status está en req.body.status
        await article.save();
        return res.json(article);
      } else {
        return res.status(400).json({ message: 'El estado solo puede ser "draft" o "publish" para un editor.' });
      }
    }
    // Si el status no coincide con ninguna de las reglas anteriores
    return res.status(400).json({ message: 'Acción no permitida para este artículo.' });
     } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
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



module.exports =  {allArticle, createArticle, detailArticleById, updateArticleById, updateStatus, asignEditor}