const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    birth: { type: Date },
    role: { type: String, enum: ['admin', 'client'], default: 'client' },
  },
  {
    collection: 'users',
    timestamps: true, //createdAt, updatedAt
  }
);
const Users = mongoose.model('users', userSchema);
module.exports = Users;
