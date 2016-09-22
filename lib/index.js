'use strict';

const Hoek = require('hoek');
const Path = require('path');
const Fs = require('fs');
const Jsonfile = require('jsonfile');
const Boom = require('boom');

module.exports.register = function (server, options, cb) {

  const defaults = {
    servable: 'static/static.json',
    path: '/statics',
    tags: ['static', 'route'],
    description: 'Renders static route defined in a file',
    responses: {
      statusCode: 400,
      message: 'No static routes found'
    },
    auth: false
  };

  options = Hoek.applyToDefaults(defaults, options);

  const rootDir = Path.resolve(__dirname).split('/node_modules')[0];
  const path = Path.join(rootDir, options.servable);

  //TODO: check whether a provided path a file or a directory. If it's a directory create a route for every file (name of the file
  // is the name of the route), otherwise load just the file content and serve it through /statics endpoint
  server.route({
    method: 'GET',
    path: options.path,
    config: {
      tags: options.tags,
      description: options.description,
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

  server.route({
    method: 'GET',
    path: options.path+"/{name}",
    config: {
      tags: options.tags,
      description: options.description,
      handler: (request, reply) => {
        return reply('WIP, bitch!')
      },
      validate: {
        params: {
          name: [Joi.array().items("things that we extracted from json")]
        }
      },
      auth: options.auth
    }
  })

  return cb();
};

module.exports.register.attributes = {
  pkg: require('../package.json')
};
