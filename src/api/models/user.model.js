const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  completeName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['editor', 'writer'], required: true }
});
// Middleware para encriptar la contraseña antes de guardar el usuario
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Si la contraseña no se ha modificado, sigue sin encriptar

  try {
    const salt = await bcrypt.genSalt(10); // Genera un salt
    this.password = await bcrypt.hash(this.password, salt); // Hashea la contraseña
    next();
  } catch (error) {
    next(error);
  }
});


// Metodo para comparar contraseñas
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
const Users = mongoose.model('user', UserSchema);
module.exports = Users;