import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ChatSocketService } from '@app/chat-app/service/chat-socket-service';

import { FormsModule } from '@angular/forms';
import { Conversation } from '@app/chat-app/chat';
import { RouterLink } from '@angular/router';
import { UsersService } from '@app/service/users-service';
import { map, of, switchMap } from 'rxjs';

interface MessageNotificationToast{
  conversationName: string;
  message: string;
  isOpen?: boolean;
  inputNewMessage?: string;
}

interface ConversationData extends Pick<Conversation, 'id'|'conversationName'>{}

@Component({
  selector: 'notification-chat-message',
  imports: [ Toast, FormsModule, RouterLink],
  templateUrl: './notification-chat-message.html',
  styles: ``,
  providers: [ MessageService ]
})
export class NotificationChatMessage {
  private messageService = inject(MessageService);
  private socketService = inject(ChatSocketService);
  private usersService = inject(UsersService);

  arrConversationsShow:string[] = [];
  allMessages:MessageNotificationToast[] = [];
  arrConversationsData:ConversationData[] = [];

  constructor(){

    this.usersService.myUserData().pipe(
      switchMap( d => this.usersService.getUserData( d.result.id ) ),
      map(data => {
        if( !data.status ) return console.log('Ocurrió un problema al obtener la información del usuario');

        if( data.result.preferencias.popupMessages ){
          this.listenMyOwnRoom();
          this.listenAllMyRooms();
        }

        
      })
    ).subscribe();
  }

  listenMyOwnRoom(){
    this.socketService.listenMyOwnRoom().subscribe( () => this.listenAllMyRooms() );
  }
  
  listenAllMyRooms(){
    
    this.socketService.listenAllMyRooms(data => {
      if( !data.result ) return console.log('boto en el listenAllMyRooms', {data});

      data.result.forEach(conver =>{
        if( this.arrConversationsData.some(e => e.id === conver.id ) ) return console.log('La conversación ya existe');

        this.arrConversationsData.push({
          id: conver.id,
          conversationName: conver.conversationName
        });

        this.listenRoom( conver.conversationName );
      });

    });

  }

  listenRoom( roomName:string ){
    this.socketService.listenRoom( roomName ).subscribe(msg => this.addMessage(roomName, msg.message.text ));
  }

  closeToast(){
    this.allMessages = [];
  }

  addMessage( roomName:string, message:string ){
    
    if( this.allMessages.find(e => e.conversationName == roomName) ){

      this.allMessages = this.allMessages.map(msg => {
        if( msg.conversationName == roomName ){
          return { ...msg, message}
        }
        return msg;
      });

    }else{

      this.allMessages = [... this.allMessages, {
        conversationName: roomName,
        message
      }];

    }
    
    this.messageService.add({
      key: 'ToastNotificationChatMessage',
      life: 5000,
      severity: 'custom',
      summary: 'Mensaje entrante',
      closable: false
    });

  }

  closeMe(conversationName:string){
    
    this.allMessages = this.allMessages.filter(e => e.conversationName !== conversationName );
    if( this.allMessages.length < 1 ) this.messageService.clear( 'ToastNotificationChatMessage' )
    
  }

  sendNewMessage( messageData:MessageNotificationToast ){
    const { conversationName, inputNewMessage } = messageData;
    if( !inputNewMessage || inputNewMessage.trim().length < 1 ) return;

    const data = {
      room: conversationName,
      message: inputNewMessage
    }

    this.socketService.sendRoomMessage(data, (response) => {
      if( response.status ){
        this.closeMe( conversationName );
      }else{
        console.error('Error:', response.message);
        alert('Ocurrió un problema al procesar el mensaje, intentelo de nuevo en unos minutos');
      }
    });
    
  }

  getIdByConversationName( conversationName:string ){
    return this.arrConversationsData.find( e => e.conversationName === conversationName )?.id ?? ''
  }

}
