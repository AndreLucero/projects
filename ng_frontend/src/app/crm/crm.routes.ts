import { Routes } from "@angular/router";

export const crmRoutes:Routes = [
    
    {
        path: 'agent_call',
        loadComponent: () => import('@app/crm/agent-call-crm/views/agent-call-crm-view/agent-call-crm-view').then(m => m.AgentCallCrmView),
        title: 'CRM Agent Call'
    },
    {
        path: '**',
        loadComponent: () => import('@app/crm/views/crm-default-view/crm-default-view').then(m => m.CrmDefaultView)
    }
];