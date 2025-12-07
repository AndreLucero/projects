import DOMPurify from 'dompurify';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Message } from '@app/chat-app/chat';
import { ChatService } from '@app/chat-app/service/chat-service';
import { UserData } from '@lib/users';
import { environment as env } from '@env/environment';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'chat-message',
  imports: [ SkeletonModule ],
  templateUrl: './chat-message.html',
  styles: ``
})
export class ChatMessage implements OnInit,OnChanges{

  @Input({required: true}) message!:Message;
  @Input({required: true}) usersData?:UserData[];

  @Output() iamRender = new EventEmitter<boolean>();
  
  userData?:UserData
  SYSTEM_USER_ID = env.SYSTEM_USER_ID;

  constructor(
    public chatService:ChatService,
    private sanitizer:DomSanitizer
  ){}

  ngOnInit(): void {
    this.iamRender.emit(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.userData = this.chatService.participantsData?.filter(e => e.id === this.message.owner).at(0);
  }

  sanitizeHtml(text: string): SafeHtml {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const htmlWithLinks = text.replace(urlRegex, (url) => {
      return `<a href="${url}" class="italic font-light underline">${url}</a>`;
    });

    const cleanHtml = DOMPurify.sanitize(htmlWithLinks); // 🔒 Elimina scripts y atributos peligrosos
    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
  }


}
