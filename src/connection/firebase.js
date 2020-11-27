import * as fcmAdmin from 'firebase-admin';

const serviceAccount = require("~/pandemix-blr-firebase.json");

fcmAdmin.initializeApp({
  credential: fcmAdmin.credential.cert(serviceAccount),
  databaseURL: "https://pandemix-blr.firebaseio.com"
});

export const sendPushNotification = async ({ deviceIds, payload }) => {
  try {
      console.log(`Initiating push notifications...`, deviceIds, payload);
      const valid_ids = deviceIds.filter(id => {
          return (id!== null && id!=="null" && id!=="undefined")
      });
      if(!valid_ids.length) return "No id(s) to send to"
      const notification_status = await fcmAdmin
      .messaging()
      .sendToDevice(
        valid_ids,
        payload,
      );
      logger.debug(`Notifications sent to: ${deviceIds}`, payload);
      logger.debug(`Status from FCM:`, notification_status.results[0]);
      return notification_status;
  }catch(err) {
      console.error(`Error sending notifications`, err);
      return false;
  }
};


export default fcmAdmin;
