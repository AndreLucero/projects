import { RolType } from "./users";

export function getLvlByRole(role?:RolType){

    if( !role ) return 0;

    const roles = {
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
    } as const;

    return roles[ role ];
}



export function dateFormat(fecha:Date, format:string){
    if( !(fecha instanceof Date) ) return '';
    
    const formats: Record<string, string> = {
        y: (fecha.getFullYear() % 100).toString(),
        Y: fecha.getFullYear().toString(),
        
        m: fecha.getMonth().toString().padStart(2,'00'),
        d: fecha.getDate().toString().padStart(2,'00'),
        
        H: fecha.getHours().toString(),
        h: (fecha.getHours() > 12 ? fecha.getHours()%12 : fecha.getHours()).toString().padStart(2,'00'),
        
        i: fecha.getMinutes().toString().padStart(2,'00'),
        s: fecha.getSeconds().toString().padStart(2,'00'),
        
    };
    
    return format.replace(/(Y|y|m|d|H|h|i|s)/g, m => formats[m] );
}