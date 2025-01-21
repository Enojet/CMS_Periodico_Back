const Users = require('../models/user.model');

const addUser = async (req, res) => {
  try {
    const data = req.body;
    const newUser = new Users(data);
    const createdUser = await newUser.save();
    return res.json({ message: 'usuario creado', data: createdUser });
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const listUsers = await Users.find();
    res.json({ success: true, list: listUsers });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { addUser, getUsers };
