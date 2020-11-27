import config from 'config';
import bunyan from 'bunyan';

const levelMap = {
  development: 'trace',
  test: 'error',
  production: 'trace',
};

const logger = bunyan.createLogger({
  name: config.get('app.name'),
  streams: [
    {
      level: levelMap[config.util.getEnv('NODE_ENV')],
      stream: process.stdout,
    },
  ],
});

// Set the logger object to be accessible across the app
global.logger = logger;

export default logger;