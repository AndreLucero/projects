import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../service/login-service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const logoutGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const fromPage = route.queryParamMap.get('fromPage') ?? '/login'; //Por defecto ponemos fromPage a '/login' para que si no tiene un fromPage, lo transfiera al login

  return loginService.logout().pipe(
    map(data => {

      //Regresamos a la página destino y la recargamos por si requiere permisos
      router.navigateByUrl( fromPage ).then(() => {
        location.reload();
      });
      
      return false;
    })
  )
};
