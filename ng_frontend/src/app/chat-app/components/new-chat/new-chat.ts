import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { ChatService } from '@app/chat-app/service/chat-service';
import { ChatSocketService } from '@app/chat-app/service/chat-socket-service';
import { UserData } from '@lib/users';
import { LoginService } from '@app/login-app/service/login-service';

import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'new-chat',
  imports: [FormsModule, Toast],
  templateUrl: './new-chat.html',
  styles: ``,
  providers: [MessageService],
})
export class NewChat implements OnInit {
  @ViewChild('btnIniciaChat') btnIniciaChat : ElementRef | undefined;

  inputConversationName= '';
  inputAddUser = '';

  hasErrors = false;

  allUsers?:UserData[];
  selectedUsers:UserData[] = [];


  inputaddUserFocus = false;

  constructor(
    public chatService:ChatService,
    private loginService:LoginService,
    private router:Router,
    private chatSocketService:ChatSocketService,
    private toastService: MessageService
  ){}

  ngOnInit(): void {
    this.getAllUsers();
  }
  
  @HostListener('window:keydown.escape', ['$event'])
  onKeyPress(evt : Event){
    this.inputaddUserFocus = false;
  }

  getAllUsers(){
    this.loginService.getAllUsers().subscribe({
      next: data => {
        if( data.status ){
          this.allUsers = data.result
        }
      }
    });
  }
  
  hasClicked( userId:string ){
    this.inputAddUser = userId;
  }

  addUserToList(){
    if( !this.allUsers ) return false;
    if( !this.inputAddUser ) return false;

    let userExist = this.selectedUsers.some(user => user.id === this.inputAddUser );
    if( userExist ) return this.inputAddUser = '';

    let userSelected = this.allUsers.find(user => user.id === this.inputAddUser);
    if( !userSelected ) return false;
    
    this.selectedUsers.push( userSelected );
    this.inputAddUser = '';
    return true;
  }

  deleteUserFromList( userId:string ){
    if( !this.selectedUsers ) return false;
    this.selectedUsers = this.selectedUsers.filter(user => user.id !== userId );

    return true;
  }


  showUserInTable( userId:string ){
    if( !this.selectedUsers ) return false;
    return this.selectedUsers.some(user => user.id === userId );
  }
  matchWithInput( username:string ){
    let regex = new RegExp( this.inputAddUser, 'i' );
    return regex.test( username )
  }

  validateSendData(){

    // if( this.inputConversationName.trim().length < 1 ) return alert('Es necesario agregar un nombre para la conversacion');
    // if( this.selectedUsers.length < 1 ) return alert('No hay ningun usuario seleccionado');
    if( this.inputConversationName.trim().length < 1 ) return this.toastService.add({key:'ToastHolder', severity:'error', summary: 'Es necesario agregar un nombre para la conversacion'});
    if( this.selectedUsers.length < 1 ) return this.toastService.add({key:'ToastHolder', severity:'error', summary: 'No hay ningun usuario seleccionado'});

    this.createNewConversation();
  }

  private createNewConversation(){

    const data = {
      conversationName: this.inputConversationName,
      participants: this.selectedUsers.map(e => e.id)      
    }  

    this.chatService.createNewConversaton(data.conversationName, data.participants).subscribe({
      next: data => {
        this.selectedUsers.forEach(user => {
          this.chatSocketService.inviteUserToRoom( user.id, data.result.conversationName )
        });
        
        this.toastService.add({key: 'ToastHolder', severity: 'success', summary: 'Se creó la conversación con éxito'});
        this.router.navigate(['/chatApp', data.result.id]);
      },
      error: ({error}) => {
        console.log(error.message)
        this.toastService.add({key: 'ToastHolder', severity: 'error', summary: error.message});
      }
      
    });

  }

}
