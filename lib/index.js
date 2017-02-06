'use strict';

const Hoek = require('hoek');
const Path = require('path');
const Fs = require('fs');
const Jsonfile = require('jsonfile');
const Boom = require('boom');

module.exports.register = function (server, options, cb) {

  const defaults = {
    servable: 'statics/static.json',
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
  Fs.stat(path, (err, stats) => {

    if (err) {
      server.log(['error'],'we couldn\'t load anything from the path you provided: '+err);
      return;
    }

    if (stats.isFile()) {
      function createRoute(path) {
        Jsonfile.readFile(path, (err, file) => {
          // I guess path will represent the folder???
          const route_path = path.basename('path', '.json');

          if (err) {
            server.log(['error'], 'couldn\'t read the file: ' +err)
            return;
          }

          server.route({
            method: 'GET',
            path: route_path,
            config: {
              tags: options.tags,
              description: options.description,
              handler: function (request, reply) {
                return reply(file);
              },
              auth: options.auth
            }
          });
        });
      }
    }

    if (stats.isDirectory()) {
      fs.readdir(path, function (err, files) {
        if (err) {
          server.log(['error'],'something is wrong with the provided path: ' +err);
          return;
        }

        if (!files || !files.length) {
          server.log(['error'],'the directory seems empty: '+err);
          return;
        }

        console.log(files);
        files.forEach(function(file) {
          return createRoute(file);
        });
      });

    }
  });
  // server.route({
  //   method: 'GET',
  //   path: options.path,
  //   config: {
  //     tags: options.tags,
  //     description: options.description,
  //     handler: function (request, reply) {
  //       Fs.stat(path, (err, stats) => {
  //         if (err) {
  //           return reply(Boom.notFound('You did not provide a proper file path, bitch!', err));
  //         }
  //
  //         console.log(stats.isDirectory());
  //
  //         Jsonfile.readFile(path, (err, file) => {
  //
  //           if (err) {
  //             return reply(Boom.badData('Could not read the file', err));
  //           }
  //
  //           return reply(file);
  //         });
  //       });
  //     },
  //     auth: options.auth
  //   }
  // });

  // server.route({
  //   method: 'GET',
  //   path: options.path+"/{name}",
  //   config: {
  //     tags: options.tags,
  //     description: options.description,
  //     handler: (request, reply) => {
  //       return reply('WIP, bitch!')
  //     },
  //     validate: {
  //       params: {
  //         // name: [Joi.array().items("things that we extracted from json")]
  //       }
  //     },
  //     auth: options.auth
  //   }
  // })

  return cb();
};

module.exports.register.attributes = {
  pkg: require('../package.json')
};
