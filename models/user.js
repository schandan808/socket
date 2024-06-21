const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchma = new Schema({
  name: { type: String },
  isActive: { type: Boolean, default: false }
});

module.exports = mongoose.model('Users', UserSchma);
