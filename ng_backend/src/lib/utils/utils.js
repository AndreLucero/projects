export function dateFormat(fecha, format){
    if( !(fecha instanceof Date) ) return '';
    
    const formats = {
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