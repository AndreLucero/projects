import { getTokenData } from '../tokens/utils.js';
import { getLvlRoltype } from '../../login-app/utils.js';

export function login_required(req, res, next){
    /*
        Valida que el cliente cuenta con un access_token valido
    */
    const { access_token } = req.cookies;

    const token = getTokenData( access_token );
    if( token === false ) return res.status(401).json({status:false, message: 'No tienes permisos para entrar a esta ruta'});
    req.access_token = token;

    return next();
}

export function login_specific_required( validRoltype ){
    /*
        Valida que el cliente cuenta con un access_token válido y sea el tipo especificado
    */
   
    if( !Array.isArray( validRoltype ) ) return console.log('El parámetro validRoltype debe ser de tipo array');
    if( validRoltype.length < 1 ) return console.log('El parámetro validRoltype debe contener al menos un valor');

    return (req, res, next) => {

        const { access_token } = req.cookies;
        const token = getTokenData( access_token );
        if( token === false ) return res.status(401).json({status:false, message: 'No tienes permisos para entrar a esta ruta'});

        if( !validRoltype.includes( token.roltype ) ) return res.status(401).json({status:false, message: 'No tienes permisos para entrar a esta ruta'});
        
        req.access_token = token;
        return next();
    }

}

export function login_specific_or_higher_required( roltype ){
    /*
        Valida que el cliente cuenta con access_token válido y sea mayor o igual 
    */

    if( !roltype ) return console.log('El parámetro roltype no puede estar vacio');

    return (req, res, next) => {

        const { access_token } = req.cookies;
        const token = getTokenData( access_token );
        if( token === false ) return res.status(401).json({status: false, message: 'No tienes permisos para entrar a esta ruta'});

        const lvl_roltype = getLvlRoltype( roltype );
        if( !lvl_roltype ) return res.status(401).json({status: false, message: 'No tienes permisos para entrar a esta ruta'})
        if( token.lvl_roltype < lvl_roltype ) return res.status(401).json({status: false, message: 'No tienes permisos para entrar a esta ruta'});

        req.access_token = token;
        return next();
    }

}