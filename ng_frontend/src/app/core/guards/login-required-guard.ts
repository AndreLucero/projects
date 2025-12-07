import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '@app/login-app/service/login-service';
import { map } from 'rxjs';

export const loginRequiredGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router)
  const loginService = inject( LoginService )
  
  return loginService.myUserData().pipe(
    map(isLogged => {
      if( isLogged.status ) return true;
      
      return router.createUrlTree(['/login'], { queryParams: { fromPage : state.url }})
    })
  );
  
};