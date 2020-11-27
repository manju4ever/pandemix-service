import Joi from '@hapi/joi';

import UserRoutes from './User';
import NotificationRoutes from './Notification';
import { enableAuthHeaderForSwagger } from '~/utils';
import { testCrossPath } from '~/controllers/RemoteNotification';

const crossPath = {
    path: '/crosspaths',
    method: 'GET',
    config: {
        auth: false,
        tags: ["api"],
        description:"[Cool Stuff] Find all the users who crossed path with a certain person",
        validate: {
            query: {
                user_id: Joi.string().description("user_id"),
                fromLast: Joi.number().integer().description("from last how many days"),
                within: Joi.number().integer().description("distance in meter(m)"),
            }
        }
    },
    handler: testCrossPath,
};

const routes =  [
    ...UserRoutes,
    ...NotificationRoutes,
    crossPath,
];

// Register all routes
export default enableAuthHeaderForSwagger(routes)