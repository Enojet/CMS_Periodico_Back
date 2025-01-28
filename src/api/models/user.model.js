const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  completeName:{type:String, required:true},
  password: { type: String, required: true },
  role: { type: String, enum: ['editor', 'writer'], required: true }
});

// Middleware para encriptar la password 
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Metodo para comparar contraseñas
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
const Users=mongoose.model('user', UserSchema);
module.exports = Users;