var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
    name: { type: String },
    givenname: { type: String },
    familyname: { type: String },
    phone1type: { type: String },
    phone1value: { type: String }
});
module.exports = mongoose.model('Contact', contactSchema);


