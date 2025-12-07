import { user_roltype } from './schemas.js';

export function getAlias(str) {
    if(!str) return false;
    let [_, second] = str.split(' ');
    let num = Math.floor( Math.random() * str.length );

    return (str[0] + (second?.at(0) ?? str[num])).toUpperCase();
}

export function getRandomColor(){
    const possibleColor =[
        'red','yellow','blue','sky','purple','violet','green',
        'pink','gray','orange','amber','cyan','emerald','indigo',
        'lime','rose','slate','teal'
    ];
    let randomNumber = Math.floor( Math.random() * possibleColor.length );

    return possibleColor[ randomNumber ];
}

export function getLvlRoltype( roltype ){

    const validRoltype = user_roltype.safeParse( roltype );
    if( !validRoltype.success ) return;

    const possibleRoles = {
        'EJECUTIVO': 1,
        'COACH': 5,
        'EJECUTIVO STAFF': 7,
        'SUPERVISOR': 10,
        'JEFE': 20,
        'ANALISTA': 30,
        'ANALISTA CREACION': 35,
        'JEFE STAFF': 40,
        'GERENTE': 50,
        'GERENTE ZONA': 55,
        'COORDINADOR': 60,
        'ADMIN': 99,
    };

    return possibleRoles[ roltype ];
}