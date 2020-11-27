import Boom from '@hapi/boom';
import uid from 'uid-safe';

import sequelize from '~/connection';
import User from  '~/models/User';
import LocationPings from '~/models/LocationPings';
import { issueTokenJWT } from '~/security';
import { notifyAllUsersWhoCrossedPathWith } from './RemoteNotification';

export const _storeLocationPing = ({ userId, lat, lng }) => {
    return LocationPings.create({
        userId,
        lat,
        lng,
        where_is: {
            type: 'Point',
            coordinates: [lng, lat],
            crs: { type: 'name', properties: { name: 'EPSG:4326'} }
        },
    }); 
};

export default {
    register: async(request, h) => {
        try {
            const user = await User.create({
                ...request.payload,
                username:`u${await uid(5)}`,
            });
            return h.response({
                status: true, 
                token: issueTokenJWT({ username: user.username, uid: user.id })
            });
        }catch(err) {
            logger.error(`Failed to create user`, err.name);
            if(err && err.errors.length) {
                return Boom.badData(err.errors[0].message);
            }
            return Boom.badRequest();
        }
    },
    login: async(request, h) => {
        try {
            const { phone, countryCode, pin } = request.payload;
            const result = await User.findOne({
                where: {
                    phone,
                    countryCode,
                    pin,
                }
            });
            if(!result) {
                return Boom.unauthorized('Bad Credentials');
            }
            return h.response({ 
                status: true, 
                token: issueTokenJWT({ username: result.username, uid: result.id })
            });
        } catch(err) {
            logger.error('Failed to login', err);
            return err;
        }
    },
    updateCovStatus: async(request, h) => {
        try {
            const { uid } = request.auth.credentials;
            const { status } = request.query;
            const user_details = await User.findOne({
                where: {
                    id: uid
                }
            });
            if(user_details.covid19_positive) {
                return Boom.forbidden('Cannot change covid-19 status');
            }
            const result = await User.update({
                covid19_positive: status,
                covid19_positive_on: (new Date()).toISOString(),
            }, {
                where: {
                    id: uid,
                }
            });
            notifyAllUsersWhoCrossedPathWith({ user_id: uid });
            return h.response({
                status: !!result,
                message: 'We will notify others who have been in contact / close proximity'
            });
        } catch(err) {
            logger.error(err);
            return Boom.badImplementation();
        }
    },
    getUserProfile: async(request, h) => {
        try {
            const { uid } = request.auth.credentials;
            const result = await User.findOne({
                where: {
                   id: uid,
                }
            });
            if(!result) return Boom.badRequest();
            if(result && result.username) {
                const { 
                    username, name, email, 
                    country, age_group, covid19_positive,
                    fcm_id, apn_id, 
                    covid19_positive_on, createdAt 
                } = result;
                return h.response({
                    username,
                    name,
                    email,
                    country,
                    age_group,
                    fcm_id,
                    apn_id,
                    covid19_positive,
                    covid19_positive_on,
                    createdAt,
                });
            }
        } catch(err) {
            logger.error(err);
            return Boom.badImplementation();
        }
    },
    updateUserProfile: async(request, h) => {
        try {
            const { uid } = request.auth.credentials;
            const { email, name, fcm_id, apn_id } = request.payload;
            const results = await sequelize.query(`
                UPDATE "users"
                SET
                    email = COALESCE(NULLIF('${email}', 'null'), NULLIF('${email}', 'undefined'), '${email}'::varchar, "email"),
                    name = COALESCE(NULLIF('${name}', 'null'), NULLIF('${name}', 'undefined'), '${name}'::varchar, "name"),
                    fcm_id = COALESCE(NULLIF('${fcm_id}', 'null'), NULLIF('${fcm_id}', 'undefined'), '${fcm_id}'::varchar, "fcm_id"),
                    apn_id = COALESCE(NULLIF('${apn_id}', 'null'), NULLIF('${apn_id}', 'undefined'), '${apn_id}'::varchar, "apn_id")
                WHERE id = ${uid}::int;
            `);
            console.debug(`User updation status:`, results[0]);
            return h.response({ status: true });
        }catch(err) {
            console.error(`Error updating profile`, err);
            return Boom.badImplementation();
        }
    },
    storeLocationPing: async(request, h) => {
        try {
            const { uid } = request.auth.credentials;
            const { lat, lng } = request.query;
            await _storeLocationPing({
                userId: uid,
                lat,
                lng,
            });
            return h.response({ status: true })
        }catch(err) {
            console.error(`Error in storing location info:`, err.message || err);
            return Boom.badImplementation();
        }
    },
    getLocationHistory: async(request, h) => {
        try {
            const { limit, offset } = request.query;
            const { uid } = request.auth.credentials;
            const results = await sequelize.query(`
                SELECT json_build_object(
                    'type',       'Feature',
                    'geometry',   ST_AsGeoJSON(where_is)::json,
                    'properties', json_build_object(
                        'created_at', created_at
                    ))
                FROM "location_pings"
                WHERE "user_id" = ${uid}::int
                ORDER BY created_at
                LIMIT ${limit}::int
                OFFSET ${offset}::int
            `);
            return h.response(results[0]);
        }catch(err) {
            console.error(`Error fetching location history`);
            return Boom.badImplementation();
        }
    },
    getOverlappingLocations: async(request, h) => {
        try {
            const { lat, lng, radius, cov_status } = request.query;
            const results = await sequelize.query(`
                WITH latest_pings AS 
                (SELECT user_id, MAX(id) id, MAX(created_at) created_at
                FROM location_pings
                WHERE ST_DWithin(
                    where_is,
                    ST_SetSRID(ST_Point(${lng}, ${lat})::geography, 4326), ${radius}
                )
                GROUP BY user_id
                ORDER BY created_at DESC)
                
                SELECT json_build_object(
                    'type',       'Feature',
                    'geometry',   ST_AsGeoJSON(lp.where_is)::json,
                    'properties', json_build_object(
                    'user_id', u.id,
                    'covid19_positive_on', u.covid19_positive_on,
                    'created_at',  lp.created_at
                )) from location_pings lp
                INNER join latest_pings lpx ON(lp.id = lpx.id)
                LEFT OUTER JOIN users u ON (lpx.user_id = u.id)
                WHERE 
                    u.covid19_positive = ${cov_status}::boolean;
            `);
            return h.response(results[0]);
        }catch(err) {
            console.error(`Error fetching overlapping locations`, err);
            return Boom.badImplementation();
        }
    }
};