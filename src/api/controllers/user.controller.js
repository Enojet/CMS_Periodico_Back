const Users = require('../models/user.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const register = async (req, res) => {
    try {
        const { username,completeName, password, role } = req.body;
        if (!['editor', 'writer'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        const user = new User({ username, completeName, password, role });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllEditor=async(req,res)=>{
    try {
        const editors = await Users.find({role:'editor'});
        if(editors.length===0){
            return res.status(404).json({ message: 'No se encontraron editores.' });
        }
        res.status(200).json(editors);
    } catch (error) {
        res.status(500).json({  error: 'Error al obtener los editores', message: error.message  });
    }
}

module.exports = { register, login, getAllEditor }