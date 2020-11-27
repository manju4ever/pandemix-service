import config from 'config';
import jwt from 'jsonwebtoken';

export const issueTokenJWT = data => {
    return jwt.sign(data, config.get('authentication.jwt.secret'));  
};

export const validateTokenJWT = (decoded, request, h) => {
    return {
        context: decoded,
        isValid: true,
    };
};