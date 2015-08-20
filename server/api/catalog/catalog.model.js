'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CatalogSchema = new Schema({
  name: String,
  readOnly: Boolean,
  isMaster: Boolean,
  items: [],
  imageID: String
});

CatalogSchema.set('versionKey', false);

module.exports = mongoose.model('Catalog', CatalogSchema);