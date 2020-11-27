module.exports = {
    app: {
      name: 'pandemix',
      connection: {
        host: process.env.APP_HOST || '0.0.0.0',
        port: process.env.APP_PORT || 8080,
        routes: {
          cors: {
            origin: ['*'],
            headers: [
              'Authorization',
              'Content-Type',
              'If-None-Match',
              'x-requested-with',
              'x-forwarded-for',
            ],
            credentials: true,
          },
        },
      },
    },
    authentication: {
      jwt: {
        secret: process.env.JWT_TOKEN_PWD || 'some-password', // maintain absolute secrecy on this
      },
      cookie: {
        password:
          process.env.COOOKIE_PWD || "some-password",
      },
    },
  };
  