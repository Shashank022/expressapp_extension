var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var azureSchema = new Schema({
    SubscriptionName: { type: String },
    SubscriptionGuid: { type: String },
    Date: { type: Date },
    ResourceGuid: { type: String },
    ServiceName: { type: String },
    ServiceType: { type: String },
    ServiceRegion: { type: String },
    ServiceResource: { type: String },
    Quantity: { type: String },
    Cost: { type: String }
  });

module.exports = mongoose.model('AzureData', azureSchema);


