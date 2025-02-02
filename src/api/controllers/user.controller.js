const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const register = async (req, res) => {
    try {
        const { username,completeName, password, role } = req.body;
        //Validar que estan todos los campos requiridos
        if (!username || !completeName || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        //Validar que el rol es correcto
        if (!['editor', 'writer'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        };
        const user = new User({ username, completeName, password, role });
        //guardar datos
        await user.save();
        res.status(201).json({ message: 'User created successfully', data:user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;//obtiene los parametros de username, y password
        const user = await User.findOne({ username });// Busca y retorna el primer elemento que coincida con el username
       // Comprueba que el usuario exista y si exites que la contraseña coincide con la contraseña almacenada
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        //si el usuario y la contraseña son correctos se genera un token
        // jwt.sing contiene 3 paramteros:
        //1- los datos que se incluyen en el token
        //2- Variable de entornoque contiene una clave secreta para firfar eñl token y garantizar autenticidad
        //3-Duración de el token de 1dia
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
       return res.json({ token, role: user.role, data:user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAllEditor=async(req,res)=>{
    try {
        //Busca todos los usuarios que tienen como role editor
        const editors = await User.find({role:'editor'});
        //Valida que encuentre editor sino muestra siguiente mensage
        if(editors.length===0){
            return res.status(404).json({ message: 'No se encontraron editores.' });
        }
         return res.status(200).json(editors);
    } catch (error) {
         return res.status(500).json({  error: 'Error al obtener los editores', message: error.message  });
    }
}

module.exports = { register, login, getAllEditor }