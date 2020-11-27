import Joi from '@hapi/joi';
import NotificationController from '~/controllers/Notification';
import NotificationModel from '~/schemas/Notification';

export default [{
    path: '/notification',
    method: 'POST',
    config: {
        tags: ['api', 'notification'],
        description: 'Post a new notification',
        validate: {
            payload: NotificationModel,
        }
    },
    handler: NotificationController.createNotification,
},{ 
    path: '/notifications',
    method: 'GET',
    config: {
        tags: ['api', 'notification'],
        description: 'Get all active notifications',
        validate: {
            query: {
                country: Joi.string().min(3).max(3).default('IND'),
                priority: Joi.string().min(1).max(3).default(1),
                limit: Joi.number().integer().default(20),
                offset: Joi.number().integer().default(0),
            },
        },
    },
    handler: NotificationController.getNotifications,
}, {
    path: '/notification/{id}/deactivate',
    method: 'PATCH',
    config: {
        tags: ['api', 'notification'],
        description: 'Deactivate Notification',
        validate: {
            params: {
                id: Joi.number().integer().required().description('Notification ID'),
            }
        }
    },
    handler: NotificationController.deactivateNotification,
}];