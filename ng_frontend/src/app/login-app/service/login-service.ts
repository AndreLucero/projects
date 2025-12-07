import { Injectable } from '@angular/core';
import { ResponseUserData } from '@lib/users';
import { catchError, Observable, of } from 'rxjs';

import { UsersService } from '@app/service/users-service';
import { GenericResponse } from '@lib/definitions';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends UsersService {

  login( data:{empleado:number, password:string} ): Observable<ResponseUserData>{
    return this.http.post<ResponseUserData>( this.API_URL, data, {withCredentials: true}).pipe(
      catchError(err => {
        if(err.status > 399 && err.status < 500) return of( err.error );
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    )
  }

  createUser( data:{nombre:string, empleado:string, password:string} ): Observable<ResponseUserData>{
    return this.http.post<ResponseUserData>( `${this.API_URL}/create`, data ).pipe(
      catchError(err => {

        if(err.status > 399 && err.status < 500) return of( err.error );
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    )
  }

  updatePassword( data:{empleado:number, old_password:string, new_password:string} ): Observable<ResponseUserData>{
    return this.http.post<ResponseUserData>( `${this.API_URL}/updatePass`, data ).pipe(
      catchError(err => {
        if(err.status > 399 && err.status < 500) return of( err.error );
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    )
  }

  logout(): Observable<GenericResponse>{
    return this.http.get<GenericResponse>(`${this.API_URL}/logout`, { withCredentials:true }).pipe(
      catchError(err =>{
        if(err.status > 399 && err.status < 500) return of( err.error );
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    )
  }

}
