import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UsersService } from '@app/service/users-service';
import { UserData } from '@lib/users';
import { map, switchMap } from 'rxjs';

export const userResolver: ResolveFn<UserData> = (route, state) => {
  const userService = inject(UsersService);

  return userService.myUserData().pipe(
    switchMap( token => userService.getUserData(token.result.id) ),
    map(data => data.result )
  )
};
