import { Injectable } from '@angular/core';
import { GenesysCloudService } from '@app/service/genesys-cloud-service';
import { GenericResponse, Uuid } from '@lib/definitions';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenCloudService extends GenesysCloudService{

  finishCall(org:string, {conversationId, participantId}: {conversationId:Uuid, participantId:Uuid}): Observable<GenericResponse>{
    
    return this.http.patch<GenericResponse>(`${this.API_URL}/${org}/conversations/finishCall/${conversationId}/${participantId}`,{ wrapupCode: "71" } ).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'})
      })
    );

  }

}
