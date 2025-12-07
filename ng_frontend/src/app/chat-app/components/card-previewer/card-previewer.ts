import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CdkMenuModule } from '@angular/cdk/menu';
import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';

import { DialogModule } from 'primeng/dialog';
import { Toast } from "primeng/toast";
import { MessageService } from 'primeng/api';

import { Conversation } from '../../chat';
import { ChatService } from '@app/chat-app/service/chat-service';
import { LoginService } from '@app/login-app/service/login-service';
import { forkJoin } from 'rxjs';
import { UserData } from '@lib/users';
import { ChatSocketService } from '@app/chat-app/service/chat-socket-service';

@Component({
  selector: 'chat-card-previewer',
  imports: [RouterLink, RouterLinkActive, CommonModule , CdkMenuModule, DialogModule, FormsModule, ClipboardModule, Toast],
  templateUrl: './card-previewer.html',
  styles: ``,
  providers: [ MessageService ]
})
export class CardPreviewer implements OnChanges{
  
  @Input({required: true}) conversation!:Conversation;
  @Input() lastMessage?:string;

  countLastResponse = 0;
  participantsInfo:UserData[] = []
  
  dialogParticipantsInfo = false;
  dialogInvitationChat = false;
  dialogConfirmationExit = false;

  invitationLink = '';

  constructor(
    private clipboard:Clipboard,
    private toastService:MessageService,
    private router:Router,
    public chatService:ChatService,
    private chatSocketService:ChatSocketService,
    private loginService:LoginService
  ){}

  ngOnChanges(changes: SimpleChanges): void {
    this.getConteo();
    this.setParticipantsData();
  }

  getConteo(){
  
    let conteo = this.conversation.messages.reduce((acc,msg) => {
      if( msg.owner === this.chatService.currentUserId ) return 0;
      return ++acc;
    }, 0);

    if( conteo !== undefined ) this.countLastResponse = conteo;
  }

  cdkParticipantsInfo(){
    this.dialogParticipantsInfo = true;
  }

  cdkCreateInvitation(){
    this.dialogInvitationChat = true;
    
    this.chatService.createInvitation( this.conversation.id ).subscribe({
      next: data => {
        if( data.status ) return this.invitationLink = data.result;
         
        this.toastService.add({
          key: 'toastCopyLink',
          severity: 'error',
          summary: 'Ocurrió un problema mientras se obtenia la invitación. Intentelo de nuevo mas tarde'
        });
      }
    })

  }

  cdkExitChat(){

    this.chatService.exitConversation( this.conversation.id ).subscribe({
      next: data => {
        if( !data.status ) return this.toastService.add({key: 'toastCopyLink', severity: 'error', summary: data.message });

        this.chatSocketService.leaveRoom( this.conversation.conversationName );

        this.chatService.updateSignal();
        if( this.chatService.currentConversation?.id === this.conversation.id ){
          this.router.navigate(['/chatApp'])
        }

        this.dialogConfirmationExit = false;
      },
      error: err => console.log(err.error.message)
    });

  }
  
  copyLink(){
    this.clipboard.copy( this.invitationLink );
    this.toastService.add({
      key: 'toastCopyLink',
      severity: 'info',
      summary: 'Se copió el enlace en el portapapeles'
    })
    this.dialogInvitationChat = false;
  }

  setParticipantsData(){
    const request = this.conversation.participants.map(participantId => this.loginService.getUserData( participantId ) );
    if( !request ) return;

    forkJoin(request).subscribe({
      next: (data) => {

        this.participantsInfo = data.map(e => {
          if(e.status) return e.result;
          return null
        }).filter(e => e !== null);

      },
      error: err => console.log('Error en el forkJoin', err)
    });

  }

  getParticipantsData(){

    this.setParticipantsData();
    return this.participantsInfo

  }

}

