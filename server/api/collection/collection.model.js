'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CollectionSchema = new Schema({
  name: String,
  items: [String]
});

module.exports = mongoose.model('Collection', CollectionSchema);