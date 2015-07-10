/**
 * Main application routes
 */

'use strict';


var errors = require('./components/errors');

module.exports = function(app) {


  // Insert routes below
//  app.route('/*')
//    .get(function(req, res) {
//      res.sendfile(app.get('appPath') + '/public/uploads/user/024048634ce5842c9df530ec6f64fca7.png');
//    });
  app.use('/api/images', require('./api/image'));
  app.use('/api/catalogs', require('./api/catalog'));
  app.use('/api/items', require('./api/item'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });

};
