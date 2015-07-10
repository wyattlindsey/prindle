'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ImageSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  filePath: String
});

module.exports = mongoose.model('Image', ImageSchema);