const Articles = require("../models/articles.model")




const add = async (req, res) => {
try{
    // Crear un nuevo artículo usando los datos del body de la solicitud
    const newArticles = new Articles(req.body)
    // Guardar el nuevo artículo en la base de datos
    const createdArticles = await newArticles.save()
    // Devolver el artículo creado como respuesta JSON
    return res.json(createdArticles)
    
}catch (error){
    //RECOGER EL ERROR CUANDO UN DATO ESTA VACIO
    }
};






const updateArticles = async (req, res) => {
    const id = req.params.id;
    const articles = req.body;

    try {
        const newArticles = await Articles.findByIdAndUpdate(id, articles, { new: true })
        return res.json(newArticles)

    } catch (error) {

    }
}
    

module.exports =  {add , updateArticles}