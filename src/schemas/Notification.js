import Joi from '@hapi/joi';

export default Joi.object().keys({
    title: Joi.string().required().min(5).max(80),
    description: Joi.string().required().min(5).max(250),
    hyperlink: Joi.string().uri(),
    priority: Joi.number().integer().min(1).max(3).default(1),
    country: Joi.string().min(3).max(3),
    expiresOn: Joi.string().isoDate(),
}).label('Notification');