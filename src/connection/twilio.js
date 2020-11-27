const accountSid = 'AC9be697bafdcf38b5f793ee696ccb4feb';
const authToken = 'e84f7c94558f4fa28e66dedd56655661';
const twilio = require('twilio')(accountSid, authToken);

const noop = () => {};
const FROM_TEL = `+12018006845`;

const onSuccess = (res) => {
    console.debug(`[Twilio] Sent notification successfully.`, res);
    return;
}
const onFailure = (err) => {
    console.debug(`[Twilio] Sent notification successfully.`, err);
    return;
}

export const sendVoiceNotification = (config = { phone_numbers: [], templateXML }) => {
    const { phone_numbers, templateXML:twiml } = config;
    const _voiceNotify = (to) => twilio.calls.create({
        twiml,
        to,
        from: FROM_TEL,
    });
    return Promise.all(phone_numbers.map(number => _voiceNotify(number))).then(onSuccess).catch(onFailure);
};

export const sendWhatsAppNotification = (config = { phone_numbers: [], message }, options = { 
    whatsapp: true,
    sms: false,
}) => {
    const { phone_numbers, message } = config;
    const { whatsapp, sms } = options;
    let prom_whatsapp = [], prom_sms = [];
    const _whatsAppNotify = (to) => twilio.messages.create({
        body:  message,
        to:`whatsapp:${to}`,
        from: `whatsapp:+14155238886`,
    });
    const _smsNotify = (to) => twilio.messages.create({
        body: message,
        to,
        from: FROM_TEL,
    });
    if(whatsapp) {
        prom_whatsapp =  [].concat(Promise.all(phone_numbers
            .map(number => _whatsAppNotify(number)))
            .then(onSuccess)
            .catch(onFailure));
    }
    if(sms) {
        prom_sms =  [].concat(Promise.all(phone_numbers
            .map(number => _smsNotify(number)))
            .then(onSuccess)
            .catch(onFailure));
    }
    return Promise.all([].concat(prom_whatsapp, prom_sms)).then(onSuccess).catch(onFailure);  
}

export default twilio;





