import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GeneralSpeedDial } from '@app/components/general-speed-dial/general-speed-dial';
import { ChatBox } from '@app/chat-app/components/chat-box/chat-box';
import { InvitationExpired } from '@app/chat-app/components/invitation-expired/invitation-expired';
import { NewChat } from '@app/chat-app/components/new-chat/new-chat';
import { SidePreviewer } from '@app/chat-app/components/side-previewer/side-previewer';
import { ChatService } from '@app/chat-app/service/chat-service';
import { ChatSocketService } from '@app/chat-app/service/chat-socket-service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { filter } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  imports: [ SidePreviewer, ChatBox, NewChat, Toast, InvitationExpired, GeneralSpeedDial ],
  templateUrl: './chat-page.html',
  styles: ``,
  providers: [ ChatService, MessageService ]
})
export class ChatPage implements OnInit{

  actualConversation:string = '';

  @ViewChild( ChatBox ) private chatBox?:ChatBox;

  constructor(
    public chatService:ChatService,
    private chatSocketService:ChatSocketService,
    private router:Router,
    private route:ActivatedRoute,
    private messageService:MessageService
  ){
    this.listenSignalUpdateConversations();
  }

  ngOnInit(): void {
    this.actualConversation = this.route.snapshot.paramMap.get('conversationId') ?? '';
    
    this.router.events.pipe( filter(e => e instanceof NavigationEnd) )
      .subscribe( () => {
        this.actualConversation = this.route.snapshot.paramMap.get('conversationId') ?? '';
        this.chatService.setCurrentConversation( this.actualConversation )
      });
    
    this.getMyConversations();
    this.setMyOwnRoomListener();
    
  }

  getMyConversations(){
    this.chatService.getMyConversations().subscribe(data => {
      if( !data.status ) return this.messageService.add({key: 'chatPageToast', severity: 'warn', summary: 'No participas en ninguna conversación'});
      if( this.actualConversation !== '' ) this.chatService.setCurrentConversation( this.actualConversation );

      data.result.forEach(e => {
        this.setRoomListener( e.conversationName );
      });

    });
  }

  private setRoomListener( roomName:string ){

    this.chatSocketService.listenRoom( roomName ).subscribe({
      next: entryMessage => {

        this.chatService.allConversations = this.chatService.allConversations.map(conver => {

          if( conver.conversationName === roomName ){
            conver.messages.push({
              id: entryMessage.message.id,
              owner: entryMessage.message.owner,
              text: entryMessage.message.text
            });
          }

          this.chatBox?.scrollToBottom();
          return conver;
        });

      },
      error: err => console.error(err)
    });

  }

  private setMyOwnRoomListener(){

    this.chatSocketService.listenMyOwnRoom().subscribe({
      next: data => {
        this.getMyConversations();
      },
      error: err => console.error({err})
    });

  }

  listenSignalUpdateConversations(){
    effect(() => {
      if( this.chatService.signalUpdateConversations() > 0 ){
        this.getMyConversations();
      }
    });
  }

}
