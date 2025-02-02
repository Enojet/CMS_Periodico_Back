
const express = require('express');//Modulo que porporciona htas utiles para manejo de rutas , peticiones HTTP y middleware
require('dotenv').config(); // Para leer variables de entorno
const connectDB = require('./src/utils/db_mongo'); // Se encarga en conectar la aplicacion con la BD a MongoDB
const router = require('./src/api/routers/routes'); //Importa las rutas para manejar las peticiones HTTP
const cors = require("cors");//Permite que el servidor acepte peticiones de otrras fuentes
const cloudinary = require("cloudinary").v2

connectDB(); // Conectar a la base de datos

//Configuraciín para la conexion con  servidor de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


const server = express();
server.use(express.json()); // Usar middleware JSON para las peticiones


server.use(cors({
  origin: "*",
  credentials: true
}))

const PORT = process.env.PORT// Usar puerto del .env o 3600 por defecto

// Usar las rutas de los artículos
server.use('/', router);

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
