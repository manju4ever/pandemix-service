import Sequelize from 'sequelize';
import sequelize from '~/connection';
import User from './User';

const LocationPings = sequelize.define('location_ping', {
    lat: {
        type: Sequelize.DOUBLE,
        notNull: true,
    },
    lng: {
        type: Sequelize.DOUBLE,
        notNull: true,
    },
    where_is: {
        type: Sequelize.GEOMETRY('POINT', 4326),
        notNull: true,
    },
}, {
    indexes: [{
        fields: ['where_is'],
        using: 'gist',
    }, {
        fields: ["user_id"],
        using: 'hash',
    }],
    timestamps: true,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'location_pings'
});

LocationPings.belongsTo(User, { 
    foreignKey: { allowNull: false },
    onDelete: 'CASCADE',
});

export default LocationPings;

