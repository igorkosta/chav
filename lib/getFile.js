'use strict';

const Boom = require('boom');
const Jsonfile = require('jsonfile');
const Fs = require('fs');
const Path = require('path');

module.exports = function (request, reply) {

  const path = Path.join(__dirname, options.path);

  Fs.stat(path, (err, stats) => {
    if (err) {
      return reply(Boom.notFound('You didn\'t provide a proper file path, bitch!', err));
    }

    Jsonfile.readFile(path, (err, file) => {

      if (err) {
        return reply(Boom.badData('Couldn\'t read the file', err));
      }

      if (!file) {
        return reply(Boom.notFound());
      }

      reply(file);
    });

  });

}
