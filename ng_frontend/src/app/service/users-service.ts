import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseUserData, ResponseUsersData, ResponseUserToken } from '@lib/users';
import { environment as env } from '@env/environment';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  protected http = inject(HttpClient);

  protected API_URL = `${env.SERVER_BACKEND}/login`;

  myUserData(): Observable<ResponseUserToken>{
    return this.http.get<ResponseUserToken>(`${this.API_URL}/user/me`, {withCredentials: true}).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'})
      })
    )
  }

  myUserDataDetails(): Observable<ResponseUserData>{
    return this.http.get<ResponseUserData>(`${this.API_URL}/user/me/details`, {withCredentials: true}).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'})
      })
    )
  }
  
  getUserData( userId:string ): Observable<ResponseUserData>{
    return this.http.get<ResponseUserData>(`${this.API_URL}/user/${userId}`, {withCredentials: true}).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    )
  }

  getAllUsers(): Observable<ResponseUsersData>{
    return this.http.get<ResponseUsersData>(`${this.API_URL}/users`, {withCredentials: true}).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    )
  }
  
}
