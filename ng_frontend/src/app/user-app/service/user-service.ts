import { Injectable } from '@angular/core';
import { UsersService } from '@app/service/users-service';
import { GenericResponse } from '@lib/definitions';
import { ResponseUserData, UserData, UserPreferences } from '@lib/users';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends UsersService {

  private userDataSubject = new BehaviorSubject<UserData|null>(null);

  get userData() : UserData|null {
    return this.userDataSubject.getValue();
  }

  set userData( newUserData:UserData ){
    this.userDataSubject.next( newUserData );
  }

  
  updateUser( data : { nombre:string, alias:string, color:string, avatar?:string|null }): Observable<ResponseUserData>{
    return this.http.patch<ResponseUserData>(`${this.API_URL}/user/${this.userData?.id}/update`, data, {withCredentials:true}).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    );
  }

  updateRolType({ userId, roltype }: { userId:string, roltype:string }){
    return this.http.patch<ResponseUserData>(`${this.API_URL}/user/${userId}/updateRole`, { roltype }, {withCredentials:true}).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of(err.error);
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    )
  }
  
  updatePreferences( data:UserPreferences ): Observable<ResponseUserData>{
    return this.http.patch<ResponseUserData>(`${this.API_URL}/user/me/updatePreferences`, data, {withCredentials:true}).pipe(
      catchError(err => {
        if(err.status > 399 && err.status < 500) return of( err.error );
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    )
  }

  deleteUser(userId:string): Observable<GenericResponse>{
    return this.http.delete<GenericResponse>(`${this.API_URL}/user/${userId}`,{withCredentials:true}).pipe(
      catchError(err => {
        if( err.status > 399 && err.status < 500 ) return of( err.error );
        return of({status:false, message: 'Ocurrió un problema con la conexión'});
      })
    )
  }
  
}
