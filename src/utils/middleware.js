const jwt = require('jsonwebtoken');
const Users = require('../api/models/user.model');

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  let data;
  try {
    const tokenVerificar = token.split(' ')[1]; // Extrae el token del encabezado Authorization
    data = jwt.verify(tokenVerificar, process.env.JWT_SECRET); // Verifica el token usando la clave secreta

  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' }); // Si el token no es válido, responde con un error 401
  };

  const user = await Users.findById(data.id); // Busca al usuario en la base de datos usando el ID del token
  if (!user) {
    return res.json({ message: 'El usuario no existe' })
  }; // Si el usuario no se encuentra, responde con un mensaje de error


  //envio delos datos del usuairo
  req.user = user; // Asigna el usuario encontrado a la solicitud (req.user)
  next(); // Llama al siguiente middleware o ruta
};
module.exports = { authMiddleware };