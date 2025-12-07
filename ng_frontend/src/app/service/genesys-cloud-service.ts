import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment as env } from '@env/environment';
import type { ResponseUserGenesys, UserId as UserIdCloud } from '@lib/genesysCloud';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenesysCloudService {
  protected http = inject(HttpClient);

  API_URL = `${env.SERVER_BACKEND}/genesys-cloud`;

  getUserById(org:string, userId:UserIdCloud ): Observable<ResponseUserGenesys>{
    return this.http.get<ResponseUserGenesys>(`${this.API_URL}/${org}/user/${userId}`).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'})
      })
    )
  }

}
