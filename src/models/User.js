import Sequelize from 'sequelize';
import sequelize from '~/connection';

const User = sequelize.define('user', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER,
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            min: 4,
            max: 10,
        },
        default: null,
    },
    pin: {
        type: Sequelize.STRING(4),
        notNull: true,
        validate: {
            len: [4, 6]
        }
    },
    countryCode: {
        type: Sequelize.STRING(3),
        validate: {
            len: [1,3]
        },
        notNull: true,
        isNumeric: true,
    },
    phone: {
        type: Sequelize.STRING,
        isNumeric: true,
        unique: true,
        isIndex: true,
        notNull: true,
        validate: {
            len: [10, 10],
        },
    },
    email: {
        type: Sequelize.STRING,
        isEmail: true,
        isIndex: true,
        default: null,
    },
    covid19_positive: {
        type: Sequelize.BOOLEAN,
        notNull: true,
        defaultValue: false,
    },
    covid19_positive_on: {
        type: Sequelize.DATE,
        default: null,
    },
    name: {
        type: Sequelize.STRING,
        default: null,
    },
    age_group: {
        type: Sequelize.SMALLINT,
        default: null,
        validate: {
            min: 0,
            max: 5,
        },
    },
    fcm_id: {
        type: Sequelize.TEXT,
        default: null,
    },
    apn_id: {
        type: Sequelize.TEXT,
        default: null,
    },
    meta: {
        type: Sequelize.JSONB,
        default: null,
    },
}, {
    indexes: [{
        fields: ["country_code", "phone", "pin"],
        using: 'btree'
    }],
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'users'
});

export default User;