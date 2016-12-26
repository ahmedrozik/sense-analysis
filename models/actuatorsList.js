
var mongoose = require('mongoose');
var createdDate = require('../plugins/createdDate');

var schema = mongoose.Schema({
    _id: { type: String, required: true}
  , actName: { type: String, required: true}
  , email: { type: String, lowercase: true, trim: true}
  , minthreshold: { type: String, required: true}
  , maxthreshold: { type: String, required: true}
  , command: { type: String, required: true}
  , sensor: { type: String, required: true}



  });

// add created date property
schema.plugin(createdDate);

// properties that do not get saved to the db
schema.virtual('fullname').get(function () {
  return this.name.first + ' ' + this.name.last;
})

module.exports = mongoose.model('ActuatorsList', schema);
