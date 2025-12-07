import { chatHandler } from "./chat-socket.js";
import { getTokenData } from "../lib/tokens/utils.js";
import cookie from "cookie";

export default function socketHandler( io ){
    
    io.use( (socket, next) => {
        /*
            Obtenemos el access_token para validaciones
        */

        const cookieHeader = socket.request.headers.cookie;
        if( !cookieHeader ) return next( new Error('no cookies found'));

        const cookies = cookie.parse(cookieHeader);
        const token_cookie = cookies['access_token'];

        const token = getTokenData( token_cookie );
        if( token === false ) return next( new Error('Token invalido'));

        socket.user = token;
        next();

    });

    io.on('connection', socket => {
        console.log('Cliente conectado al socket');
        
        chatHandler(socket, io);

    });
}