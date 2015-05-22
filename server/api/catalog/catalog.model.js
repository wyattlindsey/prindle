'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CatalogSchema = new Schema({
  name: String,
  info: String,
  items: Array,
  active: Boolean,
  readOnly: Boolean
});

module.exports = mongoose.model('Catalog', CatalogSchema);