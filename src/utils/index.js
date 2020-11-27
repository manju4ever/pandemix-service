import Joi from '@hapi/joi';

export const enableAuthHeaderForSwagger = routes =>
routes.map(route => {
   const routeConfig = route.config || route.options;
  if (routeConfig.auth && routeConfig.auth === 'jwt') {
    const modded_route = {
      ...route,
      config: {
        ...routeConfig,
        validate: {
          ...routeConfig.validate,
          headers: Joi.object({
            Authorization: Joi.string().description(
              'Authorization header containing the JSON Web Token',
            ),
          }).options({
            allowUnknown: true,
          }),
        },
      },
    };
    return modded_route;
  }
  return route;
});