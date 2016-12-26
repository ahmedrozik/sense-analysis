
var mongoose = require('mongoose');
var createdDate = require('../plugins/createdDate');
var validEmail = require('../helpers/validate/email');

var schema = mongoose.Schema({
    _id: { type: String, required: true}
  , name: { type: String, required: true}
  , email: { type: String, lowercase: true, trim: true,validate: validEmail}
  , description: { type: String, required: true}
  , longitude: { type: String, required: true}
  , latitude: {type: String, required: true }
  , field: { type: String, required: true}
  , minthreshold: { type: String, required: false}
  , maxthreshold: { type: String, required: false}
  , mobile: { type: String, required: true}
  , sms: { type: String, required: false}
  , emailEvent: { type: String, required: false}
  , type: { type: String, required: true}
  , eventSensor: { type: String, required: false}


  });

// add created date property
schema.plugin(createdDate);

// properties that do not get saved to the db
schema.virtual('fullname').get(function () {
  return this.name.first + ' ' + this.name.last;
})

module.exports = mongoose.model('Sensor', schema);
