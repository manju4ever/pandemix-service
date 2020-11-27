import config from 'config';
import EventEmitter from 'events';
import WebSocket from 'ws';
import url from 'url';
import jwt from 'jsonwebtoken';

import handler from './handler';

const AUTH_JWT = config.get('authentication.jwt');

const throwIfMissing = () => {
  throw new Error('Missing httpInstance !');
}

const defaultOptions = {
  clientTracking: false,
};

class WebSocketServer extends EventEmitter {

  constructor() {
    super();
    this._httpInstance = null;
    this._ws = null;
  }

  init(httpInstance = throwIfMissing(), options = { noServer: true }) {
    
    this._ws = new WebSocket.Server({
      ...{
        ...defaultOptions,
        ...options,
      },
    });

    const _ws = this._ws;

    httpInstance.on('upgrade', function upgrade(request, socket, head) {
      _ws.handleUpgrade(request, socket, head, function done(ws) {
          _ws.emit('connection', ws, request);
      });
    });

    logger.trace('[PandemixWS]@server has started listening');

    this._ws.on('connection', async (recpConn, req) => {
      try {
        const { token = null } = url.parse(req.url, true).query;
        const context =  await jwt.verify(token, AUTH_JWT.secret);
        logger.debug('WS@connect - ctx', context);
        if(!context.uid || !context.username) return recpConn.close(1008, 'Bad Credentials');
        else recpConn.on('message', handler.bind(null, context));
      }catch(err) {
        recpConn.close();
      }
    });

    this._ws.on('error', (err) => {
      logger.fatal(err, {
        type: '[PandemixWS]@error',
      });
    });
  }

}

export default new WebSocketServer();

