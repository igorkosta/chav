'use strict';

const Hoek = require('hoek');
const Path = require('path');
const Fs = require('fs');
const Jsonfile = require('jsonfile');
const Boom = require('boom');

module.exports.register = function (server, options, cb) {

  const defaults = {
    filePath: 'statics/static.json',
    path: '/statics',
    tags: ['static', 'route'],
    responses: {
      statusCode: 400,
      message: 'No static routes found'
    },
    auth: false
  };

  options = Hoek.applyToDefaults(defaults, options);

  const path = Path.join(__dirname, options.filePath);

  //TODO: check whether a provided path a file or a directory. If it's a directory create a route for every file (name of the file
  // is the name of the route), otherwise load just the file content and serve it through /statics endpoint
  server.route({
    method: 'GET',
    path: options.path,
    config: {
      tags: options.tags,
      description: 'Renders static route defined in a file',
      handler: function (request, reply) {
        Fs.stat(path, (err, stats) => {
          if (err) {
            return reply(Boom.notFound('You did not provide a proper file path, bitch!', err));
          }

          Jsonfile.readFile(path, (err, file) => {

            if (err) {
              return reply(Boom.badData('Could not read the file', err));
            }

            return reply(file);
          });
        });
      },
      auth: options.auth
    }
  });

  return cb();
};

module.exports.register.attributes = {
  pkg: require('../package.json')
};
