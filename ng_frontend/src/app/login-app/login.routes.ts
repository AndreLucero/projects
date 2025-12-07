import { Routes } from "@angular/router";
import { logoutGuard } from "./guard/logout-guard";

export const loginRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('@app/login-app/views/login-view/login-view').then(m => m.LoginView),
        pathMatch: 'full'
    },
    {
        path: 'logout',
        canActivate: [ logoutGuard ],
        loadComponent: () => import('@app/login-app/views/logout-view/logout-view').then(m => m.LogoutView)
    }
];