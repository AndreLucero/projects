import { inject, Injectable } from '@angular/core';
import { CrmService } from '@app/crm/service/crm-service';
import { GenericResponse, Uuid } from '@lib/definitions';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import  type { CrmRow, CrmRowPrerecord, ResponseFinesGestion, ResponseInfoCelulares } from '../agent_call';
import { GenCloudService } from '@app/crm/service/gen-cloud-service';

@Injectable({
  providedIn: 'root'
})
export class CrmAgentCallService extends CrmService {
  genCloudService = inject(GenCloudService);

  private readonly organization = 'organization2';

  private numempleadoSubject = new BehaviorSubject<string|null>(null);
  public numempleado$ = this.numempleadoSubject.asObservable();

  get numempleado():string|null{
    return this.numempleadoSubject.getValue();
  }
  set numempleado(newVal:string){
    this.numempleadoSubject.next(newVal);
  }

  protected get api_agent_call_crm(){
    return this.API_URL + '/agent_call'
  }

  getAllFines(): Observable<ResponseFinesGestion>{
    return this.http.get<ResponseFinesGestion>(`${this.api_agent_call_crm}/allfines`).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    );
  }

  getAllCelulares(): Observable<ResponseInfoCelulares>{
    return this.http.get<ResponseInfoCelulares>(`${this.api_agent_call_crm}/celulares/modelos`).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    );
  }

  insertPrerecord( data: CrmRowPrerecord ): Observable<GenericResponse>{
    return this.http.post<GenericResponse>(`${this.api_agent_call_crm}/insertPrerecord`, data ).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    )
  }

  updatePrerecord( data: CrmRow ): Observable<GenericResponse>{
    return this.http.patch<GenericResponse>(`${this.api_agent_call_crm}/savefinishcall`, data).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    )
  }

  getUser( userId:Uuid ){
    return this.genCloudService.getUserById(this.organization, userId).pipe(
      tap(data => {
        if( data.status ) this.numempleado = data.result.numempleado;
      })
    )
  }

  finishCall(data:{conversationId:Uuid, participantId:Uuid}){
    return this.genCloudService.finishCall(this.organization, data);
  }

  getUserKpiIndicators(numempleado:string): Observable<GenericResponse>{
    return this.http.get<GenericResponse>(`${this.api_agent_call_crm}/user/${numempleado}/kpi-indicators`).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    );
  }

  getUserKpiFingestion(numempleado:string): Observable<GenericResponse>{
    return this.http.get<GenericResponse>(`${this.api_agent_call_crm}/user/${numempleado}/kpi-fingestion`).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    );
  }
}
