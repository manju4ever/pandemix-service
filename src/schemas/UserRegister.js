import Joi from '@hapi/joi';

export default Joi.object().keys({
    pin: Joi.string().min(4).max(6).required(),
    countryCode: Joi.string().min(1).max(3).required(),
    phone: Joi.string().min(10).max(12).required(),
    name: Joi.string().max(100).allow(null).default(null),
    email: Joi.string().email().allow(null).default(null),
    age_group: Joi.number().integer().min(0).max(5).default(0).allow(null).default(null),
    meta: Joi.object().unknown().description("Meta properties of user"),
    fcm_id: Joi.string().description("Firebase cloud messaging ID").allow(null).default(null),
    apn_id: Joi.string().description("Apple Notification ID").allow(null).default(null)
}).label('UserRegistration');