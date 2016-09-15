'use strict';

const Hoek = require('hoek');
const Path = require('path');

console.log(Path.resolve(__dirname, 'statics', 'static.json'));

module.exports.register = function (server, options, cb) {

  const defaults = {
    folder: 'statics',
    file: 'static.json',
    path: '/statics',
    tags: ['static', 'route'],
    responses: {
      statusCode: 400,
      message: 'No static routes found'
    },
    auth: false
  };

  options = Hoek.applyToDefaults(defaults, options);

  server.route({
    method: 'GET',
    path: options.path,
    config: {
      tags: options.tags,
      description: 'Renders static route defined in a file',
      handler: require('./getFile.js'),
      auth: options.auth
    }
  });

  return cb();
};

module.exports.register.attributes = {
  pkg: require('../package.json')
};
