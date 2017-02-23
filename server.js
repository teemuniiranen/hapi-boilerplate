const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const server = new Hapi.Server();

function registerServerPlugins(callback) {
  server.register([
    Inert,
    Vision, {
      register: HapiSwagger,
      options: {
        info: {
          title: 'API Documentation',
          version: Pack.version,
        },
        securityDefinitions: {
          jwt: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
          },
        },
        security: [{ jwt: [] }],
      },
    },
  ], (err) => {
    if (err) throw err;
  });

  callback();
}

server.connection({
  port: process.env.PORT || 8000,
  routes: {
    cors: true,
  },
});

server.route({
  method: 'GET',
  path: '/imalive',
  handler(req, res) {
    return res({
      status: 'OK',
    });
  },
  config: {
    auth: false,
    description: 'Get imalive',
    notes: 'Service to check if API is alive. No authentication needed.',
    tags: ['api'],
  },
});

module.exports = {
  start(callback) {
    server.start((serverErr) => {
      if (serverErr) throw serverErr;

      console.log('Server running at:', server.info.uri);

      if (callback) callback();
    });

    server.on('request-error', (request, err) => {
      console.error(`Error response (500) sent for request: ${request.id} at ${request.url.path} because:`, err);
    });
  },

  stop(callback) {
    server.stop(callback);
  },
};

// server mode, called directly
if (require.main === module) {
  registerServerPlugins(() => {
    module.exports.start(() => {
    });
  });
}
