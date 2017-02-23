const appserver = require('../server.js');
const supertest = require('supertest-as-promised');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');

const server = supertest.agent('http://localhost:8000');
chai.use(chaiAsPromised);
const should = chai.should(); // eslint-disable-line no-unused-vars

describe('API Utils', () => {
  before((done) => {
    appserver.start(done);
  });

  after((done) => {
    appserver.stop(done);
  });

  it('should be able to answer to imalive', () =>
    server
    .get('/imalive')
    .expect(200)
    .expect('Content-type', /json/)
    .then(res => res.body.status.should.equal('OK')));
});
