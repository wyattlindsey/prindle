'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: String,
  weight: {},
  category: String,
  imageID: String,
  readOnly: Boolean
});

ItemSchema.set('versionKey', false);

module.exports = mongoose.model('Item', ItemSchema);