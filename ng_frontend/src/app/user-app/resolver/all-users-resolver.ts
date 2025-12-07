import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from '../service/user-service';
import { map } from 'rxjs';
import { UserData } from '@lib/users';

export const allUsersResolver: ResolveFn<UserData[]> = (route, state) => {
  const userService = inject(UserService);

  return userService.getAllUsers().pipe(
    map(data => data.result)
  );
};
