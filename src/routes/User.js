import Joi from '@hapi/joi';
import UserController from '~/controllers/User';
import UserLogin from '~/schemas/UserLogin';
import UserRegister from '~/schemas/UserRegister';
import UserUpdate  from '~/schemas/UserUpdate';

export default [{
    path: '/',
    method:'GET',
    config: {
        auth: false,
        description: 'The root of all beauty',
    },
    handler: (request, h) => h.response({ if: 'you', wannaJoinUs: true, call: '+91 7259769413'})
},{
    path: '/account/register',
    method: 'POST',
    config: {
        auth: false,
       description: 'Register a new user',
       tags: ["api", "account"],
       validate: {
           payload: UserRegister
       }
    },
    handler: UserController.register,
}, {
    path: '/account/login',
    method: 'POST',
    config: {
        auth: false,
        description: 'login to pandemic tracker',
        tags: ["api", "account"],
        validate: {
            payload: UserLogin,
        },
    },
    handler: UserController.login,
},
{
    path: '/account/verify',
    method: 'POST',
    config: {
        auth: 'jwt',
        description: 'login to pandemic tracker',
        tags: ["api", "account"],
    },
    handler: (request, h) => h.response({ status: true })
}, {
    path: '/account/covid19',
    method: 'PUT',
    config: {
        auth: 'jwt',
        description: 'Update Covid-19 status of the user',
        tags: ['api', 'user'],
        validate: {
            query: {
                status: Joi.boolean().required(),
            }
        },
    },
    handler: UserController.updateCovStatus,
}, {
    path: '/account/profile',
    method: 'GET',
    config: {
        auth: 'jwt',
        description: 'Get user profile',
        tags: ['api', 'user'],
    },
    handler: UserController.getUserProfile,
}, {
    path: '/account/profile',
    method: 'PUT',
    config: {
        auth: 'jwt',
        description: 'Get user profile',
        tags: ['api', 'user'],
        validate: {
            payload: UserUpdate,
        }
    },
    handler: UserController.updateUserProfile,
},{
    path: '/account/ping',
    method: 'PUT',
    config: {
        auth: 'jwt',
        description: 'Ping current location of the user',
        tags: ['api', 'user'],
        validate: {
            query: {
                lat: Joi.number().precision(9).description('Latitude').required(),
                lng: Joi.number().precision(9).description('Longitude').required(),
            },
        },
    },
    handler: UserController.storeLocationPing,
}, {
    path: '/account/pings',
    method: 'GET',
    config: {
        auth: 'jwt',
        description: 'Get location ping history of a user',
        tags: ['api', 'user'],
        validate: {
            query: {
                limit: Joi.number().integer().max(50).default(10),
                offset: Joi.number().integer().max(50).default(0),
            }
        },
        handler: UserController.getLocationHistory,
    }
}, {
    path: '/account/pings/overlaps',
    method: 'GET',
    config: {
        auth: false,
        description: 'Get overlapping user Id(s) and location details of other users',
        tags: ['api', 'user'],
        validate: {
            query: {
                lat: Joi.number().precision(9).required().description('Latitude'),
                lng: Joi.number().precision(9).required().description('Longitude'),
                radius: Joi.number().integer().min(1000).max(10000).default(3000).required().description('radius in meters(mt)'),
                cov_status: Joi.boolean().required().description("covid-19 status").default(true),
                limit: Joi.number().integer().min(10).max(30).default(10),
                offset: Joi.number().integer().max(99).default(0),
            }
        }
    },
    handler: UserController.getOverlappingLocations,
}];