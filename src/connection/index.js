import config from 'config';
import Sequelize from 'sequelize';

const db_details = config.get('db');

const sequelize = new Sequelize({
    username: db_details.username,
    password: db_details.password,
    database: db_details.database,
    dialect: 'postgres',
    host: db_details.host,
    port: db_details.port,
    sync: {
        force: db_details.force_update === "true" ? true : false || false,
    },
    logging: false,
});

export default sequelize;