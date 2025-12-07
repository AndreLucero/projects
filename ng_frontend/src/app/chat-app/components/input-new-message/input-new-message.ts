import DOMPurify from 'dompurify';

import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ChatSocketService } from '@app/chat-app/service/chat-socket-service';
import { ChatService } from '@app/chat-app/service/chat-service';
import { Toast } from "primeng/toast";
import { MessageService } from 'primeng/api';
import { Uuid } from '@lib/definitions';

@Component({
  selector: 'input-new-message',
  imports: [ReactiveFormsModule, Toast],
  templateUrl: './input-new-message.html',
  styles: ``,
  providers: [ MessageService ]
})
export class InputNewMessage {

  @Output() onNewMessage = new EventEmitter<string>();

  formulario = new FormGroup({
    message: new FormControl('', [ Validators.required ])
  });

  constructor(
    private chatService:ChatService,
    private socketService:ChatSocketService,
    private messageService:MessageService 
  ){}

  handlerSubmit(){
    if( this.formulario.invalid ) return this.errorMessage('Es necesario agregar un mensaje para enviarlo');
    if( !this.chatService.currentConversation?.conversationName ) return this.errorMessage('Ocurrio un problema obteniendo la conversacion actual');

    const { message } = this.formulario.value;
    if( !message ) return this.errorMessage('Es necesario que el campo texto este lleno');

    const newMessage = DOMPurify.sanitize( message );
    if( newMessage.trim().length < 1 ) return this.errorMessage('El mensaje no puede llevar contenido malicioso')

    const conversationName = this.chatService.currentConversation.conversationName;
    const data = {
      room: conversationName,
      message: newMessage
    }

    this.socketService.sendRoomMessage(data, (response) => {
      if( !response.status ){
        console.error('Error:', response.message);
        this.messageService.add({key:'inputNewMessageToast', severity:'error', summary:'Ocurrió un problema al procesar el mensaje, intentelo de nuevo en unos minutos'});
      }
      
      this.chatService.currentConversation?.messages.push({
        owner: this.chatService.currentUserId as Uuid,
        text: newMessage
      });

      this.formulario.reset();
      this.onNewMessage.emit(newMessage);
    });

  }

  private errorMessage( message:string ){
    this.messageService.add({
      key: 'inputNewMessageToast',
      severity: 'warn',
      summary: message
    })
  }

}
