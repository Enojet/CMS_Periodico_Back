const Articles = require("../models/articles.model");
const Users=require("../models/user.model");
const mongoose=require('mongoose');

const allPublishArticles = async (req, res) => {
  try {
    const articles = await Articles.find({ status: 'publish' }) // Filtra solo los artículos publicados
      .sort({ date: -1 }) // Ordena por fecha descendente
      .populate('author', ' completeName') // Popula los campos de `author`
      .populate('editorId', 'completeName'); // Popula los campos de `editorId`

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const articlesByAuthor = async (req, res) => {
  const { idAutor } = req.params;  // Obtén el ID del autor desde los parámetros de la URL

  try {
    // Busca al autor por ID (usamos populate para obtener los detalles completos del autor)
    const author = await Users.findById(idAutor);
    
    if (!author) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }

    // Buscar los artículos que tienen este ID de autor
    const articles = await Articles.find({ author: idAutor })
      .populate('author', 'username completeName')  // Poblar el autor con nombre completo y username
      .populate('editorId', 'username completeName');  // Poblar el editor

    // Si no hay artículos para este autor, devolver un mensaje
    if (articles.length === 0) {
      return res.status(404).json({ message: 'No se encontraron artículos para este autor' });
    }

    // Devuelve los artículos encontrados
    return res.json(articles);

  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los artículos del autor', error: error.message });
  }
};
const articlesByEditor = async (req, res) => {
  const { idEditor } = req.params;  // Obtén el ID del editor desde los parámetros de la URL

  try {
    // Verifica si el editor existe (usando el editorId en la base de datos)
    const editor = await Users.findById(idEditor);
    
    if (!editor) {
      return res.status(404).json({ message: 'Editor no encontrado' });
    }

    // Buscar los artículos que tienen este ID de editor (editorId)
    const articles = await Articles.find({ editorId: idEditor })
      .populate('author', 'username completeName')  // Poblar el autor (nombre completo y nombre de usuario)
      .populate('editorId', 'username completeName');  // Poblar el editor (nombre completo y nombre de usuario)

    // Si no hay artículos para este editor, devolver un mensaje
    if (articles.length === 0) {
      return res.status(404).json({ message: 'No se encontraron artículos para este editor' });
    }

    // Devuelve los artículos encontrados
    return res.json(articles);

  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los artículos del editor', error: error.message });
  }
};
const createArticle = async (req, res) => {
  try {
    // Desestructuramos los datos que vienen en el body de la solicitud
    const { title, subtitle, date, section, image, body, author, status, editorId } = req.body;

    // Verificar que el autor y el editor existan en la base de datos
    const authorExists = await Users.findById(author);
    const editorExists = await Users.findById(editorId);

    if (!authorExists) {
      return res.status(404).json({ message: 'El autor no existe' });
    }

    if (!editorExists) {
      return res.status(404).json({ message: 'El editor no existe' });
    }

    // Crear un nuevo artículo
    const newArticle = new Articles({
      title,
      subtitle,
      date,
      section,
      image,
      body,
      author,
      status,
      editorId
    });

    // Guardar el artículo en la base de datos
    const createdArticle = await newArticle.save();

    // Enviar la respuesta con el artículo recién creado
    return res.status(201).json(createdArticle);

  } catch (error) {
    console.error('Error al crear el artículo:', error);
    return res.status(500).json({ message: 'Hubo un error al crear el artículo', error: error.message });
  }
};

const detailArticleById = async (req, res) => {
  try {
    // Obtener el id desde los parámetros de la URL
    const { IdA } = req.params;  // Asegúrate de acceder al parámetro 'IdA'

    if (!IdA) {
      return res.status(400).json({ message: "El ID es requerido." });
    }

    // Buscar el artículo por su id y estado 'draft'
    const articleId = await Articles.find({ 
      _id: IdA, 
         });

    if (articleId.length === 0) {
      return res.status(404).json({ message: "Artículo no encontrado." });
    }

    // Responder con los artículos encontrados
    res.json(articleId);
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ message: error.message });
  }
};
const updateArticleById = async (req, res) => {
  const { id } = req.params; // Obtener el ID del artículo desde los parámetros
  const articleUpdates = req.body; // Obtener los datos del artículo desde el cuerpo de la solicitud

  try {
    // Buscar el artículo en la base de datos
    const findArticle = await Articles.findById(id);

    // Si el artículo no existe, devolver un error
    if (!findArticle) {
      return res.status(404).json({ msg: 'Artículo no encontrado' });
    }

    // Verificar si el artículo está en estado 'publish', no se debe poder editar
    if (findArticle.status === 'publish') {
      return res.status(403).json({
        message: 'No se puede editar un artículo publicado'
      });
    }

    // Si el artículo está en estado 'draft' o 'review', proceder con la actualización
    const updatedArticle = await Articles.findByIdAndUpdate(id, articleUpdates, { new: true });

    // Si la actualización fue exitosa, responder con el artículo actualizado
    return res.status(200).json({ message: 'Artículo actualizado correctamente', updatedArticle});
  } catch (error) {
    // Manejo de errores
    return res.status(400).json({ message: error.message });
  }
};
const updateStatus = async (req, res) => {
  try {
    const article = await Articles.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Solo el writer puede cambiar el estado de 'draft' a 'review'
    if (article.status === 'draft') {
      if (req.params.status === 'review') {
        article.status = 'review';
        await article.save();
        return res.json(article);
      } else {
        return res.status(400).json({ message: 'El estado solo puede ser pasar de "draft" a "review".' });
      }
    }

    // El editor puede cambiar el estado de 'review' a 'draft' o 'publish'
    if (article.status === 'review') {
      if (req.params.status && ['draft', 'publish'].includes(req.params.status)) {
        article.status = req.params.status; // Asume que el nuevo status está en req.params.status
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
const asignEditor = async (req, res) => { 
  try {
    // Extraer el ID del artículo y el ID del editor desde los parámetros de la URL
    const idEditor = req.params.idE;  // ID del editor
    const idArticle = req.params.idA;  // ID del artículo

    // Buscar el artículo por ID
    const article = await Articles.findById(idArticle);
    
    // Si el artículo no existe, devolver un error 404
    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Verificar si el artículo ya tiene asignado un editor (comprobamos si el editor está en el array de editorId)
    if (article.editorId && article.editorId.toString() === idEditor) {
      return res.status(400).json({ message: 'El editor ya está asignado a este artículo' });
    }

    // Verificar si el artículo está en estado 'review'
    if (article.status !== 'review') {
      return res.status(400).json({ message: 'Solo se pueden asignar artículos en revisión' });
    }

    // Buscar al editor por su ID
    const editor = await Users.findById(idEditor);
    if (!editor || editor.role !== 'editor') {
      return res.status(400).json({ message: 'Editor no válido o sin el rol adecuado' });
    }
   
    // Asignar el editor al artículo
    article.editorId = idEditor;

    // Guardar los cambios en la base de datos
    const updatedArticle = await article.save();

    // Responder con el artículo actualizado
    return res.status(200).json({ message: 'Editor asignado con éxito', data: updatedArticle });
    
  } catch (error) {
    // Manejo de errores generales
    res.status(500).json({ message: error.message });
  }
};



module.exports =  {allPublishArticles, articlesByAuthor, articlesByEditor, createArticle, detailArticleById, updateArticleById, updateStatus , asignEditor}