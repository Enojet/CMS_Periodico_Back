
const express = require('express');
require('dotenv').config(); // Para las variables de entorno
const connectDB = require('./src/utils/db_mongo'); // Conexión a MongoDB
const router = require('./src/api/routers/routes'); // Asegúrate de que esta importación sea correcta

connectDB(); // Conectar a la base de datos

const server = express();
server.use(express.json()); // Usar middleware JSON para las peticiones

const PORT = process.env.PORT// Usar puerto del .env o 3600 por defecto

// Usar las rutas de los artículos
server.use('/', router);

server.listen(PORT, () => {
console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
