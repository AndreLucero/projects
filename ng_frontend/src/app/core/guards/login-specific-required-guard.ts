import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '@app/login-app/service/login-service';
import { map } from 'rxjs';

export const loginSpecificRequiredGuard = (validRole:string|string[]) => {
  return ( route:ActivatedRouteSnapshot, state:RouterStateSnapshot ) => {
    
    const router = inject(Router);
    const loginService = inject(LoginService);

    return loginService.myUserData().pipe(
      map(data => {
        if( !data.status ) return router.createUrlTree(['/login'], { queryParams: {fromPage: state.url} });
        const { roltype } = data.result;
        let role = roltype.toUpperCase();

        if( Array.isArray( validRole ) && !validRole.includes( role ) ) return router.createUrlTree(['/login'], { queryParams: {fromPage:state.url} });
        if( !Array.isArray( validRole ) && role !== validRole.toUpperCase() ) return router.createUrlTree(['/login'], { queryParams: {fromPage: state.url} });

        return true;
      })
    );

  }

};