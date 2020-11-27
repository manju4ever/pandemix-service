require('dotenv').config();
require('./src/utils/logger');
require('./src/server');
// Catch Unhandled Rejections Globally
process.on('unhandledRejection', (reason, p) => {
  logger.error(
    '\n[Promise Rejection] (System Level at the best) at Promise: ',
    p,
    'Reason:',
    reason,
    '\n',
  );
});

process.on('SIGINT', () => {
  logger.fatal(`Forceful Server Shutdown detected !`);
  process.exit(255);
});
