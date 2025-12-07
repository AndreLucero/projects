import { Routes } from '@angular/router';
import { loginRequiredGuard } from './core/guards/login-required-guard';
import { PruebaView } from './views/prueba-view/prueba-view';
import { NotFoundView } from './views/errors/not-found-view/not-found-view';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('@app/home-app/home.routes').then(m => m.homeRoutes),
        title: 'Home Page'
    },
    {
        path: 'login',
        loadChildren: () => import('./login-app/login.routes').then(m => m.loginRoutes),
        title: 'Iniciar Sesión'
    },
    {
        path: 'chatApp',
        loadChildren: () => import('./chat-app/chat.routes').then(m => m.chatRoutes),
        canActivate: [ loginRequiredGuard ],
        title: 'ChatApp'
    },
    {
        path: 'prueba',
        component: PruebaView
    },
    {
        path: 'user',
        loadChildren: () => import('@app/user-app/user.routes').then(m => m.userRoutes),
        canActivate: [ loginRequiredGuard ],
        title: 'Profile Settings'
    },
    {
        path: 'crm',
        loadChildren: () => import('@app/crm/crm.routes').then(m => m.crmRoutes),
        title: 'CRM'
    },
    {
        path: 'loros/secret',
        loadChildren: () => import('@app/secret/secret.routes').then(m => m.secretRoutes),
        title: 'LittleSecret',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: NotFoundView,
        title: 'Page Not Found'
    }
];
