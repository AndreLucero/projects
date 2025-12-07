import { Injectable, signal } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';
import { SocketService } from 'src/app/service/socket-service';
import { ResponseConversations, SocketRoomMessage } from '../chat';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService extends SocketService{

  private roomMessageSubject = new Subject<SocketRoomMessage>();
  roomMessage$ = this.roomMessageSubject.asObservable();

  signalNotificationInfo = signal(0);

  constructor(){
    super();

    this.socket.on('room-message', message => {
      this.roomMessageSubject.next( message );
    });
    
  }

  sendRoomMessage( data:{room:string, message:string}, callback?:({status, message}:{status?:boolean,message?:string})=>void ){
    this.socket.emit('message-room', data, callback);
  }

  inviteUserToRoom( userId:string, roomName:string ){
    this.socket.emit('invite-user-to-room', {userId, newRoomName: roomName} );
  }

  listenRoom( roomName:string ){
    this.socket.emit('join-to', roomName);
    return this.roomMessage$.pipe( filter(m => m.room === roomName) );
  }
  
  listenAllMyRooms( callback:( data:ResponseConversations )=>void ){
    this.socket.emit('listen-all-my-rooms', callback);
  }

  listenMyOwnRoom(){
    this.socket.emit('join-to-own-room');

    return new Observable<{roomName:string}>( subscriber => {
      this.socket.on('notification-join', data => {
        subscriber.next( data );
      });      
    });
  }

  leaveRoom( roomName:string ){
    this.socket.emit('leave-room', roomName);
  }

}
