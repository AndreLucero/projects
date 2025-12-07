import { Injectable } from '@angular/core';
import { UserData } from '@lib/users';

@Injectable({
  providedIn: 'root'
})
export class AllUsersService {
  
  allUsers:UserData[] = [];

}
