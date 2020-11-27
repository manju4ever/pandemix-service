import { sendPushNotification } from '~/connection/firebase';
import { sendSMS } from '~/connection/tfactor';
import { sendVoiceNotification, sendWhatsAppNotification } from '~/connection/twilio';

import { getUsersWhoCrossedPathWith } from '~/controllers/Selectors';

export const notifyAllUsersWhoCrossedPathWith = async ({ user_id, fromLast, within }) => {
    try { 
        const message = `You might have been recently exposed to COVId-19 person recently. If you're exhibiting some serious symptoms, all 1507 immediately`;
        const psh_msg_template = `You might have been recently exposed to COVId-19 person recently.`;
        const whatsapp_msg_template = `
        🦠 Extremely Important 🦠
🏳️ You might have been recently exposed to COVId-19 person recently. \n
🏳️ If you're not facing any symptoms do not panic, but be vigilant about it.\n
🚩 If you're exhibiting some serious symptoms,perfom the following steps:\n
🚩 Don't have contact with any other members nearby.\n
🚩 😷 Wear a mask. Wash your hands thoroughly. \n
🚩 Use sanitizer to rub your hands again. \n
🚩 Call 1507 (India) now.\n`;

        const user_details = await getUsersWhoCrossedPathWith({ user_id, fromLast, within });
        // Send Push Notifications
        sendPushNotification({
            deviceIds: user_details.map(user => user.fcm_id || null),
            payload: {
                notification: {
                    title: `⚠️ Caution Needed`,
                    body: psh_msg_template,
                    tag: 'emergency',
                  },
                  data: {
                    tag: 'emergency',
                  },
                }
            });
        
        // Send SMS Notifications
        sendSMS({
            phone_numbers: user_details.map(user => user.phone || null),
            message: '⚠️ ' + message,
        });

        const phone_with_ctr_codes =  user_details
            .filter(user => (user.phone && user.phone!=='null' && user.phone!=='undefined'))
            .map(user => `+${user.country_code}${user.phone}`);

        //  Send Voice Notifications
        sendVoiceNotification({
            phone_numbers: phone_with_ctr_codes,
            templateXML:`<?xml version="1.0" encoding="UTF-8"?>
            <Response>
                 <Pause>2</Pause>
                <Say>Hello there this is an emergency call from Pandemic Tracker</Say>
                <Pause>2</Pause>
                <Say>${message}</Say>
            </Response>`
        });

        // whatsapp + SMS
        sendWhatsAppNotification({
            phone_numbers: phone_with_ctr_codes,
            message: whatsapp_msg_template,
        }, {
            whatsapp: true,
            sms: false,
        });

        return {
          user_details
        };
    }catch(err) {
        console.error(`Error doing cross path operation`, err);
        return err;
    }
}

export const testCrossPath = async (request, h) => h.response(await notifyAllUsersWhoCrossedPathWith({
    user_id: request.query.user_id,
    fromLast: request.query.fromLast,
    within: request.query.within,
}));


