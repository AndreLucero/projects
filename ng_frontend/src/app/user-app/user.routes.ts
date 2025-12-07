import { Routes } from "@angular/router";
import { userResolver } from "./resolver/user-resolver";
import { allUsersResolver } from "./resolver/all-users-resolver";
import { loginSpecificOrHigherRequiredGuard } from "@app/core/guards/login-specific-or-higher-required-guard";

export const userRoutes : Routes = [
    {
        path: '',
        loadComponent: () => import('@app/user-app/views/user-page/user-page').then(m => m.UserPage),
        resolve: {
            userData: userResolver
        },
        children: [
            { path: '', redirectTo: 'perfil', pathMatch: 'full' },
            {
                path: 'perfil',
                loadComponent: () => import('@app/user-app/views/profile-view/profile-view').then(m => m.ProfileView)
            },
            {
                path: 'privacidad',
                loadComponent: () => import('@app/user-app/views/privacidad-view/privacidad-view').then(m => m.PrivacidadView)
            },
            {
                path: 'control',
                loadComponent: () => import('@app/user-app/views/users-control-view/users-control-view').then(m => m.UsersControlView),
                resolve: {
                    allUsers: allUsersResolver
                },
                canActivate: [
                    loginSpecificOrHigherRequiredGuard('SUPERVISOR')
                ]
            }
        ]
    }
];