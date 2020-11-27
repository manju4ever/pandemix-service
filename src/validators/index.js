import Joi from '@hapi/joi';

export const OBJECT_ID_PATTERN = new RegExp(/^[0-9a-fA-F]{24}$/);
export const APPID_PATTERN = new RegExp(/^[0-9a-zA-Z$@]{7,14}$/);
export const API_KEY_PATTERN = Joi.string().max(85);
export const APPID_ALLOWED_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@';
export const APPID_ALLOWED_CHARS_LENGTH = 7;

export const isValidClientId = clientId => !(clientId === '' || clientId === 'null' || clientId === 'undefined');

export const isValidRecpId = recpId => !(recpId === '' || recpId === 'null' || recpId === 'undefined');

export const validateJson = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    return (parsed && typeof parsed === 'object') ? parsed : null;
  } catch (e) { return null; }
};