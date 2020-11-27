import sequelize from '~/connection';

export const getUserTravelPath = async ({ user_id, fromLast = 14 }) => {
    const query = `
    SELECT ST_AsText(ST_MakeLine (where_is ORDER BY created_at))
    AS travel_path
    FROM "location_pings" lp
    WHERE
        lp.created_at > current_date - interval '${fromLast}' day
        AND lp.user_id = ${user_id}::int;
    `;
    const results = await sequelize.query(query);
    return results[0][0];
}

export const getUsersWhoCrossedPathWith = async ({ user_id, fromLast = 14, within = 2 }) => {
    logger.debug(`Obtaining nearest neighbors that crossed path with userId:${user_id} from last ${fromLast} days within ${within} meters.`)
    try {
        const {travel_path} = await getUserTravelPath({ user_id, fromLast });
        const query = `SELECT DISTINCT(u.id), u.fcm_id, u.username, u.country_code, u.phone  FROM "location_pings" lp, "users" u
            WHERE
                u.covid19_positive = false::bool
                AND lp.user_id = u.id
                AND lp.user_id != ${user_id}::int
                AND	ST_DWithin(
                    lp.where_is,
                    ST_SetSRID(ST_GeographyFromText('${travel_path}')::geography, 4326), 
                    ${within}::int
                );`;
       const results =  await sequelize.query(query);
       logger.debug(`Users who crossed path with user:${user_id}:`, results[0]);
       return results[0];
    }catch(err) {
        console.error(`Error geting cross pathed users`, err);
        return err;
    }
};