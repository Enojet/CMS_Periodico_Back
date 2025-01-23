const express = require('express'); 
const connectDB = require('./src/utils/db_mongo');
const routes = require('./src/api/routers/routes');
require('dotenv').config();
connectDB();

const server = express();

//Middleware para el JSON
server.use(express.json());

const PORT = process.env.PORT || 4200;

server.use('/', routes);
server.listen(PORT, () => {
  console.log(`Server running port http://localhost:${PORT}`);
});

/*
server.use((req, res, next) => {
  console.log('Request: ${req.method} ${req.url}');
  next
})
*/