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

describe('Chav plugin with default options', () => {

  let server;

  before((done) => {

    createServer(null, (err, _server) => {

      server = _server;
      done(err);
    });
  });

  it('should throw an error if folder is empty', (done) => {

    server.inject({
      method: 'GET',
      url: '/statics'
    }, (response) => {
      expect(response.statusCode).to.equal(404);
      expect(response.result).to.equal({ statusCode: 404,
                                         error: 'Not Found',
                                         message: 'You did not provide a proper file path, bitch!' });
      done();
    });
  });

});

describe('Chav plugin with wrong servable', () => {
  let server;

  before((done) => {

    createServer({servable: 'doesntexist'}, (err, _server) => {

      server = _server;
      done(err);
    });
  });

  it('should throw a 404', (done) => {

    server.inject({
      method: 'GET',
      url: '/statics'
    }, (response) => {
      expect(response.statusCode).to.equal(404);
      expect(response.result).to.equal({ statusCode: 404,
                                         error: 'Not Found',
                                         message: 'You did not provide a proper file path, bitch!' });
      done();
    });
  });

});

describe('Chav plugin with broken json file', () => {
  let server;

  before((done) => {

    createServer({servable: '../test/statics/broken.json'}, (err, _server) => {

      server = _server;
      done(err);
    });
  });

  it('should throw a 422', (done) => {

    server.inject({
      method: 'GET',
      url: '/statics'
    }, (response) => {
      expect(response.statusCode).to.equal(422);
      expect(response.result).to.equal({ statusCode: 422,
                                         error: 'Unprocessable Entity',
                                         message: 'Could not read the file' });
      done();
    });
  });

});

describe('Chav plugin with correct servable', () => {
  let server;

  before((done) => {

    createServer({servable: '../test/statics/static.json'}, (err, _server) => {

      server = _server;
      done(err);
    });
  });

  it('should render the json file', (done) => {

    server.inject({
      method: 'GET',
      url: '/statics'
    }, (response) => {
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.equal({ beers:
                                          [ { id: '1', name: 'IPA' },
                                          { id: '2', name: 'Stout' },
                                          { id: '3', name: 'Lager' } ] });
      done();
    });
  });

});

describe('Chav plugin with correct servable and different path', () => {
  let server;

  before((done) => {

    createServer({servable: '../test/statics/static.json', path: '/beers'}, (err, _server) => {

      server = _server;
      done(err);
    });
  });

  it('should render the json file', (done) => {

    server.inject({
      method: 'GET',
      url: '/beers'
    }, (response) => {
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.equal({ beers:
                                          [ { id: '1', name: 'IPA' },
                                          { id: '2', name: 'Stout' },
                                          { id: '3', name: 'Lager' } ] });
      done();
    });
  });

});
