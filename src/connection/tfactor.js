import Axios from 'axios';
import FormData from 'form-data';

const API_KEY = `d3478d6d-740a-11ea-9fa5-0200cd936042`;
const BASE_URL = `https://2factor.in/API/V1/${API_KEY}`;
const PSMS_URL = `${BASE_URL}/ADDON_SERVICES/SEND/PSMS`;

export const sendSMS = async (config = { phone_numbers:[], message: "Hope you are safe ad sound !" }) => {
    try {
        const { phone_numbers, message } = config;

        const valid_numbers = phone_numbers.filter(phone => {
            return (phone!== null && phone!=="null" && phone!=="undefined")
        });
        
        if(!valid_numbers.length) return "No phone number(s) to send to";

        logger.debug(`Initiating SMS Message Dispatch...`);
        const formData = new FormData();
        formData.append('From', 'PDXTRA');
        formData.append('Msg', message);
        formData.append('To', valid_numbers.reduce((text, number) => text+','+number), '');
        const sms_status = await Axios.post(PSMS_URL, null, {
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        logger.debug(`Sent SMS successfully`, config);
        return sms_status;
    }catch(err) {
        logger.error(`Error Sending SMS Messages`, err);
        return false;
    }
};