import Boom from '@hapi/boom';
import sequelize from '~/connection';

import Notification from '~/models/Notification';

export default {
    createNotification: async (request, h) => {
        try{
            const { payload } = request;
            const results = await Notification.create(payload);
            return h.response({ status: !!results });
        }catch(err) {
            return Boom.badImplementation();
        }
    },
    getNotifications: async (request, h) => {
        try{
            const  { limit, offset, country, priority } = request.query;
            const results = await sequelize.query(`
                SELECT * from "global_notifications"
	            WHERE 
                    "country" = COALESCE('${country}'::varchar, "country")
                    AND "priority" = COALESCE(${priority}::smallint, "priority")
                ORDER BY 
                    "created_at" DESC
                LIMIT ${limit}
                OFFSET ${offset};
            `);
            return h.response(results[0]);
        }catch(err) {
            console.error('Fetch Notifications failed', err);
            return Boom.badImplementation();
        }
    },
    deactivateNotification: async (request, h) => {
        try{
            const { id } = request.params;
            const results = await Notification.update({
                active:false,
            }, {
                where: {
                    id,
                }
            });
            return h.response({ status: !!results });
        }catch(err) {
            console.error(`Error deactivating notification with id`, err);
            return Boom.badImplementation();
        }
    },
};