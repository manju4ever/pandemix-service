import { _storeLocationPing } from '~/controllers/User';

export default (ctx, _payload) => {
   try {
        const payload = JSON.parse(_payload);
        switch(payload.cmd) {
            case 'ping' : {
                _storeLocationPing({
                    userId: ctx.uid,
                    lat: payload.data[0],
                    lng: payload.data[1],
                });
            }
        }
   }catch(err) {
      logger.error(`[WS]Handlers-Error`, err);
   }
};