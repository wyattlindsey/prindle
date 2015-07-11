'use strict';

var multer = require('multer');
var gm = require('gm');

module.exports = function(req, res, next) {
  return multer({
    dest: 'server/public/images/',
    onFileUploadComplete: function(file, req, res) {
      req.body.name = file.name;
      gm('server/public/images/' + file.name).resize(280, 280)
        .write('server/public/images/' + file.name, function(err) {
          if (err) console.log('error processing image');
        });
    }
  });
};