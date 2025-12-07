import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

import { environment as env } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket = io( env.SERVER_BACKEND ,{
    path: '/ws',
    transports: ['polling', 'websocket'],
    withCredentials: true
  });
  
}
