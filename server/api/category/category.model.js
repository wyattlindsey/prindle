'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  readOnly: Boolean,
  imageID: String
});

module.exports = mongoose.model('Category', CategorySchema);