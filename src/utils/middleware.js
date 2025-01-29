const jwt = require('jsonwebtoken');
const Users=require('../api/models/user.model');

const authMiddleware = async(req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  let data;
  try {
     const tokenVerificar=token.split(' ')[1];
     data = jwt.verify(tokenVerificar, process.env.JWT_SECRET);
    
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  };
  //Buscar en la base de datos el usuario del token
  
  const user=await Users.findById(data.id);
  if(!user){
    return res .json({message:'El usuario no existe'})};

//envio delos datos del usuairo
req.user=user;
next();
};
module.exports = {authMiddleware};