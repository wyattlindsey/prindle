'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CatalogSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  readOnly: Boolean
});

CatalogSchema.set('versionKey', false);

module.exports = mongoose.model('Catalog', CatalogSchema);