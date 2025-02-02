const multer = require("multer");// Procesa archivos cuando el formulario tiene la propiedad multipart/form-data
const cloudinary = require("cloudinary").v2; // Interactuar con el servicio de Cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');// Interactuar con el servicio de Cloudinary

const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Instancia de Cloudinary
    params: {
        folder: "imgNoticias", // Nombre del folder en Cloudinary donde se guardarán las imágenes
        allowedFormats: ["jpg", "png", "jpeg", "svg", "gif"] // Tipos de formatos permitidos
    }
});
const upload = multer({ storage: storage });
module.exports = upload;