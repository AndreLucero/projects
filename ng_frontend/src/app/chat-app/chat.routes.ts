import { Routes } from "@angular/router";

export const chatRoutes : Routes = [
    {
        path: '',
        loadComponent: () => import('@app/chat-app/views/chat-page/chat-page').then(m => m.ChatPage)
    },
    {
        path: ':conversationId',
        loadComponent: () => import('@app/chat-app/views/chat-page/chat-page').then(m => m.ChatPage)
    }
];