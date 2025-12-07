import express from 'express';
import http from 'http';
import { Server as SocketIoServer } from 'socket.io';

import { PORT, SERVER_FRONTEND } from './lib/config.js';
import { configWebSocket } from './websockets/config.js';
import socketHandler from './websockets/socketHandler.js';

import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { seed as postgresSeed } from './lib/database/postgres/seed/seed.js';

import { chatRouter } from './chat-app/routes.js';
import { loginRouter } from './login-app/routes.js';
import { scheduleRouter } from './schedule-app/routes.js';
import { crmRouter } from './crm/routes.js';
import { genesysCloudRouter } from './genesys-cloud/routes.js';

import { login_required } from './lib/utils/middlewares.js';
import { setIO } from './websockets/io-instance.js';
import { initAgenda } from './schedule-app/agenda/agenda.js';

const whiteList = [SERVER_FRONTEND];
const corsOption = {
    origin: (origin, callback) =>{
        if( whiteList.includes( origin) ){
            callback(null, true);
        }else{
            callback(null, false);
        }
    },
    credentials: true
}

const app = express();
const server = http.createServer( app );

/*-------------------SEED----------------*/

await postgresSeed();

/*-----------------FIN SEED---------------*/



/*-------------------WEBSOCKETS----------------*/

const io = new SocketIoServer( server, configWebSocket);
setIO( io ); //Guardamos la instancia para poder utilizarla en cualquier parte
socketHandler(io);

/*-----------------FIN WEBSOCKETS----------------*/



/*-------------------MIDDLEWARES----------------*/

app.use( morgan('dev') );
app.use( cookieParser() );
app.use( express.json() );
app.use( express.urlencoded() );
app.use( cors(corsOption) );


/*------------------FIN MIDDLEWARES-------------*/



/*----------------------AGENDA------------------*/

// await initAgenda();

/*--------------------FIN AGENDA------------------*/



/*----------------------RUTAS-------------------*/

app.use('/login', loginRouter);
app.use('/chat', login_required, chatRouter);
// app.use('/schedule', scheduleRouter);
app.use('/crm', crmRouter);

app.use('/genesys-cloud/:organization', (req, res, next) => {
    req.genesys_cloud_org = req.params.organization.toLowerCase();
    next();
},genesysCloudRouter);

/*--------------------FIN RUTAS-------------------*/


app.get('/', (req,res) => {
    return res.json('Hola Mundo');
});


server.listen( PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});