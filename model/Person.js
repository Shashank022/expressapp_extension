var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = new Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  gender: { type: String },
  address: { type: String }
});
module.exports = mongoose.model('Person', personSchema);