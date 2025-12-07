import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterLink, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsersService } from '@app/service/users-service';
import { RolType } from '@lib/users';
import { getLvlByRole } from '@lib/utils';
import { map } from 'rxjs';

export const loginSpecificOrHigherRequiredGuard = ( 
  validRole:RolType, 
  options:{ redirectOnReject?:boolean } = {}
) => {
  const { redirectOnReject = true } = options;
  const lvlValidRole = getLvlByRole(validRole);

  return ( route:ActivatedRouteSnapshot, state:RouterStateSnapshot ) => {
    const router = inject(Router);
    const usersService = inject(UsersService);
    
    let onReject: () => boolean | UrlTree = () => router.createUrlTree(['/login'], { queryParams: {fromPage: state.url} });
    if( redirectOnReject ){
      onReject = () => false;
    }

    return usersService.myUserData().pipe(
      map(data => {
        if( !data.status ) return onReject();
        const { lvl_roltype } = data.result;
        if( lvl_roltype < lvlValidRole ) return onReject();

        return true;
      })
    );

  }
};