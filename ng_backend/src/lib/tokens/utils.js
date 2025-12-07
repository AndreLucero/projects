import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config.js';
import { validate as validUuid } from 'uuid';

import { GenericException } from '../utils/Exceptions.js';

export function signToken({id, username, roltype, lvl_roltype }){

    const token = jwt.sign(
        {id, username, roltype, lvl_roltype},
        JWT_SECRET_KEY,
        { expiresIn: '24hr' }
    );

    return token;
}

export function getTokenData( access_token ){

    if( !access_token ) return false;
    
    try{
        
        const token = jwt.decode(access_token, JWT_SECRET_KEY);

        if( !token ) throw new GenericException('El token de acceso no es valido');
        if( !token.iat || !token.exp ) throw new GenericException('El token no cuenta con la informacion necesaria');
        if( !validUuid( token.id ) ) throw new GenericException('El token proporcionado no es válido');
        
        const {iat, exp, ...publicData} = token;
    
        return token;

    }catch(err){
        return false;
    }

}