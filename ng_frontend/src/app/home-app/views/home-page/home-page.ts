import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeneralSpeedDial } from '@app/components/general-speed-dial/general-speed-dial';
import { CardApplicationPreviewSkeleton } from '@app/home-app/components/card-application-preview-skeleton/card-application-preview-skeleton';
import { CardApplicationPreview } from '@app/home-app/components/card-application-preview/card-application-preview';
import { AppInformation } from '@app/home-app/home';

@Component({
  selector: 'home-page',
  imports: [ CardApplicationPreview, CardApplicationPreviewSkeleton, FormsModule, GeneralSpeedDial ],
  templateUrl: './home-page.html',
  styles: ``
})
export class HomePage {
  inputSearch = '';

  appRoutesInformation:AppInformation[] = [
    { path: '/login', srcImage: '/assets/img/loginPage.png', appName: 'Iniciar Sesión' },
    { path: '/chatApp', srcImage: '/assets/img/chatPage.png', appName: 'ChatApp', loginRequired: true},
    { path: '/prueba', srcImage: '', appName: 'PruebaApp'},
    { path: '/user', srcImage: '/assets/img/userPage.png', appName: 'Profile Settings', loginRequired: true},
    { path: '/crm/agent_call', srcImage: '/assets/img/crmAgentCall.png', appName: 'Crm Agent Call' }
  ];

  getAppsOrdered(){
    return this.appRoutesInformation.sort((a,b) => a.path.localeCompare( b.path ))
  }

  filterInputSearch( path:string ){
    const regex = new RegExp( this.inputSearch, 'i');
    return regex.test( path );
  }

}
