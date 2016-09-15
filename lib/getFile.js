'use strict';

const Boom = require('boom');
const Jsonfile = require('jsonfile');

module.exports = function (request, reply) {
  // const pth = path.resolve(__dirname, options.folder, options.file);

  const path = '../statics/static.json';

  Jsonfile.readFile(path, (err, file) => {

    if (err) {
      return reply(Boom.badData('Couldn\'t read the file', err));
    }

    if (!file) {
      return reply(Boom.notFound());
    }

    reply(file);
  });
}
