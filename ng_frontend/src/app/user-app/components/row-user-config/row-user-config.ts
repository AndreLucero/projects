import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { UserIcon } from '@app/components/user-icon/user-icon';
import { AllUsersService } from '@app/user-app/service/all-users-service';
import { UserService } from '@app/user-app/service/user-service';
import { ToastMessage } from '@app/user-app/user';
import { PrimeNgSeverity } from '@lib/definitions';
import { UserData } from '@lib/users';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'row-user-config',
  imports: [ ReactiveFormsModule, UserIcon, ConfirmDialog ],
  templateUrl: './row-user-config.html',
  styles: ``,
  providers:[ ConfirmationService ]
})
export class RowUserConfig implements OnInit{
  @Input({required: true}) user!:UserData;
  @Output() rowUserMessage = new EventEmitter<ToastMessage>();

  saveDisabled = true;

  formulario = new FormGroup({
    rolType: new FormControl('')
  });

  constructor(
    public userService:UserService,
    private allUsersService:AllUsersService,
    private confirmationService:ConfirmationService
  ){}

  ngOnInit(){

    this.formulario.patchValue({
      rolType: this.user.roltype
    })

    this.formulario.get('rolType')?.valueChanges.subscribe(roltype => {
      this.saveDisabled = roltype === this.user.roltype
    });

  }

  saveUserData( ){
    const { rolType } = this.formulario.value;
    if( rolType === this.user.roltype ) return this.emitMessage('info', 'El valor a guardar es el mismo que el actual del usuario');
    if( !this.user.id || !rolType ) return this.emitMessage('warn', 'No se encontró la información requerida para actualizar el usuario');

    this.userService.updateRolType({userId: this.user.id, roltype: rolType}).subscribe(data => {
      if( !data.status ) return this.emitMessage('error', data.message);
      this.user = data.result;
      this.saveDisabled = true;
    })
  }

  confirmDelete( userId:string ){

    this.confirmationService.confirm({
      key: 'RowUserConfigConfirmation',
      message: `${this.user.numempleado}`,
      header: 'Confirmación',
      closeButtonProps: {
        
      },
      rejectLabel: 'Cancel',
      rejectButtonProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true,
      },
      acceptButtonProps: {
          label: 'Borrar',
          severity: 'danger',
      },
      accept: () => {
        this.deleteUser( userId );
      }
    });

  }

  private deleteUser( userId:string ){

    this.userService.deleteUser( userId ).subscribe(data => {
      if( !data.status ) return console.log('Boto la peticion del delete');

      this.allUsersService.allUsers = this.allUsersService.allUsers.filter(e => e.id !== userId );
      return this.emitMessage('info',`Se elimino el usuario ${this.user.numempleado}`);
    });

  }

  emitMessage(type:PrimeNgSeverity, message:string){
    this.rowUserMessage.emit({type, message});
  }

}
