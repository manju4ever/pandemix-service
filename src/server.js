import http from 'http';
import config from 'config';
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import HapiJWTAuth from 'hapi-auth-jwt2';

import WebSockInstance from '~/websock-server';
import sequelize from '~/connection';
import Routes from './routes';
import HapiSwaggerOptions from './utils/HapiSwaggerOptions';
import { validateTokenJWT } from '~/security';

const APP_CONFIG = config.get('app');

const httpInstance = http.createServer();

const server = new Hapi.Server({
  ...APP_CONFIG.connection,
  listener: httpInstance,
});

async function init() {
  try {
    server.ext('onPreStart', async () => {
      try {
        //Initialize WebSock Server
        WebSockInstance.init(httpInstance);
        //Make sure db is connected and init models
        await sequelize.authenticate();
        await sequelize.sync();
        logger.info(`[Pandemix:DB] Connection Successful.`);
      } catch(err) {
        logger.fatal(`Couldn't start required pre-requisite items`, err);
        process.exit(420);
      }
    });

    await server.register([
        Inert,
        Vision, 
        {
          plugin: HapiSwagger,
          options: HapiSwaggerOptions,
        },
        {
          plugin: HapiJWTAuth,
        }
    ]);

    // Call the validator explicitly
    server.validator(require('@hapi/joi'))

    // Setup Auth Strategies
    server.auth.strategy('jwt', 'jwt', {
      key: config.get('authentication.jwt.secret'),
      validate: validateTokenJWT,
      options: {
        verifyOptions: {
          algorithms: ['HS256'],
        },
      },
    });

    server.auth.default('jwt');

    Routes.forEach(route => server.route(route));

    await server.start();

    logger.debug(`Server started Successfully at: ${server.info.uri}`)

  } catch(err) {
     logger.error(`Server init error`, err);
     process.exit(255);
  }
};

init();

export default server;