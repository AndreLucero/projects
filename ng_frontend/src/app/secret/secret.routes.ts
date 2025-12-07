import { Routes } from "@angular/router";
import { NotFoundView } from "@app/views/errors/not-found-view/not-found-view";

export const secretRoutes: Routes = [
    {
        path: 'hnm',
        loadComponent: () => import('@app/secret/hnm/views/hnm-view/hnm-view').then(m => m.HnmView),
        title: 'Himno Nacional Mexicano'
    },
    {
        path: '**',
        component: NotFoundView,
        title: 'Page Not Found'
    }
];