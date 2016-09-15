'use strict';

const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const before = lab.before;

const createServer = function (options, callback) {

  const server = new Hapi.Server({
    debug: false
  });

  server.connection();

  server.register({
    register: require('../'),
    options
  }, (err) => {

    callback(err, server);
  });
}
