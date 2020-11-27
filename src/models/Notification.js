import Sequelize from 'sequelize';
import sequelize from '~/connection';

export default sequelize.define('global_notification', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        notNull: true,
    },
    title: {
        type: Sequelize.STRING,
        notNull: true,
    },
    description: {
        type: Sequelize.STRING,
        notNull: true,
    },
    hyperlink: {
        type: Sequelize.STRING,
    },
    priority: {
        type: Sequelize.SMALLINT,
        validate: {
            min: 1,
            max: 3
        }
    },
    country: {
        type: Sequelize.STRING,
        validate: {
            len: [3, 3],
        }
    },
    active: {
        type: Sequelize.BOOLEAN,
        notNull: true,
        default: false,
    },
    expiresOn: {
        type: Sequelize.DATE,
        default: null,
    }
}, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'global_notifications',
});