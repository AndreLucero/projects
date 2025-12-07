import { Routes } from '@angular/router';

export const homeRoutes : Routes = [
    {
        path: '',
        loadComponent: () => import('@app/home-app/views/home-page/home-page').then(m => m.HomePage)
    }
];