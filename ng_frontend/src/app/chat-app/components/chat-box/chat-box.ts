import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '@app/chat-app/service/chat-service';
import { ChatMessage } from '../chat-message/chat-message';
import { RouterLink } from '@angular/router';
import { InputNewMessage } from '../input-new-message/input-new-message';

@Component({
  selector: 'chat-box',
  imports: [ ChatMessage, RouterLink, InputNewMessage ],
  templateUrl: './chat-box.html',
  styles: ``
})
export class ChatBox implements OnInit{

  @ViewChild('messageContainer') private messageContainer ?: ElementRef;

  constructor(
    public chatService:ChatService
  ){}

  ngOnInit(): void {
    this.scrollToBottom();
  }

  scrollToBottom(){
    setTimeout(() => { this.scroll() }, 0); //Espero 0 segundos solo para esperar a que se renderice el nuevo mensaje
  }

  private scroll(){
    if( !this.messageContainer ) return;    
    const elem = this.messageContainer.nativeElement;
    elem.scrollTop = elem.scrollHeight;
  }

}
