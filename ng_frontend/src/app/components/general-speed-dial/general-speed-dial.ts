import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import type { MenuItem } from 'primeng/api';
import { SpeedDial } from 'primeng/speeddial';

import { DragDropModule, CdkDrag } from '@angular/cdk/drag-drop';
import { CdkMenuModule } from '@angular/cdk/menu';
import { UserService } from '@app/user-app/service/user-service';

@Component({
  selector: 'general-speed-dial',
  imports: [SpeedDial, CdkDrag, DragDropModule, CdkMenuModule],
  templateUrl: './general-speed-dial.html',
  styles: ``
})
export class GeneralSpeedDial implements OnInit, OnChanges {
  userService = inject(UserService);
  router = inject(Router);

  items: MenuItem[] | null = null;
  showDial = true;
  canDrag = false;

  ngOnInit(): void {
    this.actionsDial();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.actionsDial();
  }

  closeSpeedDial(){
    this.showDial = false;
  }

  /***************************FUNCIONES PARA EL DIAL**********************/
  actionsDial(){

    this.items = [
      {
          label: 'Centro de Proyectos',
          icon: 'pi pi-home',
          command: () => {
            this.router.navigate(['/']);
          },
      }
    ];

    this.userService.myUserDataDetails().subscribe(data =>{
      this.userDial(data.status)
      if(data.status) this.userService.userData = data.result;
    });

  }

  userDial( isLoggin:boolean ){
    if( isLoggin ){

      this.items?.push({
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.router.navigate(['login','logout'], {queryParams: { fromPage: this.router.url }});
        },
      });

      this.items?.push({
        label: 'Editar Perfil',
        icon: 'pi pi-user-edit',
        command: () => {
          this.router.navigate(['user','perfil']);
        },
      });

      this.items?.push({
        label: 'ChatApp',
        icon: 'pi pi-comments',
        command: () => {
          this.router.navigate(['chatApp']);
        },
      });

    }else{

      this.items?.push({
        label: 'Iniciar Sesión',
        icon: 'pi pi-sign-in',
        command: () => {
          this.router.navigate(['login'], {queryParams: { fromPage: this.router.url }});
        },
      });

    }

    
  }

}
