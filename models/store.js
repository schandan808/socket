const  mongoose = require ('mongoose');
const { Schema } = mongoose;

const StoreSchma = new Schema({
  title:{type: String},
  description:{type:String},
  file_name:{type:String},
  file_path:{typr:String},
  completed:{type:Boolean,default:true}
});

module.exports = mongoose.model('store', StoreSchma);
