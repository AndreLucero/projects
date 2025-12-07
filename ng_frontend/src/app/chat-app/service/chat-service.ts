import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { Conversation, ResponseConversation, ResponseConversations, ResponseInvitationLink } from '../chat';
import { LoginService } from '@app/login-app/service/login-service';
import { UserData } from '@lib/users';
import { GenericResponse, Uuid } from '@lib/definitions';

import { environment as env } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private loginService = inject(LoginService);

  private API_URL = `${env.SERVER_BACKEND}/chat`;

  allConversations:Conversation[] = [];
  
  currentConversation?:Conversation;
  participantsData?:UserData[];
  currentUserId = '';

  signalUpdateConversations = signal(0);

  constructor(){
    this.loginService.myUserData().subscribe({
      next: data => {
        if (!data.status) return console.error('Ocurrió un error mientras se obtenia la información del usuario');
        this.currentUserId = data.result.id;
      }
    })
  }

  setCurrentConversation( conversationId:string ){
    let newConversation = this.allConversations.find(e => e.id === conversationId);
    this.currentConversation = newConversation;
  }

  getMyConversations() : Observable<ResponseConversations> {
    return this.http.get<ResponseConversations>( `${this.API_URL}/conversation/me`, {withCredentials: true}).pipe(
      map(data => {
        this.allConversations= data.result;
        this.setParticipantsData();
        return data;
      }),
      catchError(err => {
        this.allConversations = [];
        if( err.status > 399 && err.status < 500) return of( err.error );
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    )
  }

  setParticipantsData(){
    
    let allParticipants = new Set<string>();
    this.allConversations.forEach(conver => {
      conver.participants.concat( conver.messages.flatMap(e => e.owner) ).forEach(e => allParticipants.add(e))
    });

    let request = [... allParticipants].map( participant => this.loginService.getUserData( participant) );
    forkJoin(request).subscribe({
      next: (userData) => {

        this.participantsData = userData.flatMap(resp => {
          if(resp.status) return resp.result;
          return;
        }).filter(e => e !== undefined);

      },
      error: err => console.log('Error en el forkJoin', err)
    });

  }

  createNewConversaton( conversationName:string, participants:Uuid[] ): Observable<ResponseConversation>{
    return this.http.post<ResponseConversation>(`${this.API_URL}/conversation/create`, {conversationName, participants}, {withCredentials: true}).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of( err.error );
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    );
  }

  createInvitation( conversationId:string ){
    return this.http.post<ResponseInvitationLink>(`${this.API_URL}/invitation/create`,{ conversationId }, {withCredentials:true}).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of( err.error );
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    );

  }

  exitConversation( conversationId:string ){
    return this.http.patch<GenericResponse>(`${this.API_URL}/conversation/${conversationId}/exit`, {}, {withCredentials:true}).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of( err.error );
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    );
  }

  updateSignal(){
    this.signalUpdateConversations.update(e => ++e);
  }

}
