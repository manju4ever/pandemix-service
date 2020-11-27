import Joi from '@hapi/joi'

export default Joi.object().keys({
    pin: Joi.string().min(4).max(6).required(),
    countryCode: Joi.string().min(1).max(3).required(),
    phone: Joi.string().min(10).max(10).required(),
}).label('User');