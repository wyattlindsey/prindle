'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CollectionSchema = new Schema({
  name: String,
  items: [Number]   // id's of Item objects
});

module.exports = mongoose.model('Collection', CollectionSchema);