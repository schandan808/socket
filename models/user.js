const  mongoose = require ('mongoose');
const { Schema } = mongoose;

const UserSchma = new Schema({
  name: String,
});

module.exports = mongoose.model('Users', UserSchma);
