import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SwitchToggle } from '@app/user-app/components/switch-toggle/switch-toggle';
import { LoginService } from '@app/login-app/service/login-service';
import { UserService } from '@app/user-app/service/user-service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import type { UserPreferences } from '@lib/users';

@Component({
  selector: 'privacidad-view',
  imports: [ ReactiveFormsModule, Toast, SwitchToggle ],
  templateUrl: './privacidad-view.html',
  styles: ``,
  providers: [ MessageService ]
})
export class PrivacidadView {

  formUpdatePass = new FormGroup({
    oldPass: new FormControl('', [Validators.required]),
    newPass: new FormControl('', [Validators.required])
  });

  formPreferences = new FormGroup({
    popupMessages: new FormControl(true, [Validators.required]),
    bubbleGeneral: new FormControl(true, [Validators.required])
  });

  constructor(
    public userService:UserService,
    private messageService:MessageService,
    private loginService:LoginService
  ){

    this.formPreferences.patchValue({
      popupMessages: this.userService.userData?.preferencias.popupMessages,
      bubbleGeneral: this.userService.userData?.preferencias.bubbleGeneral
    });

    this.formPreferences.get('popupMessages')?.valueChanges.subscribe(newVal => newVal !== null && this.updatePreferences({popupMessages: newVal}) );
    this.formPreferences.get('bubbleGeneral')?.valueChanges.subscribe(newVal => newVal !== null && this.updatePreferences({bubbleGeneral: newVal}) );

  }

  handleUpdatePass(){
    if( this.formUpdatePass.invalid ) return this.messageService.add({key: 'UserPageToast', severity: 'warn', summary: 'Es necesario llenar todos los campos'});

    const { oldPass, newPass } = this.formUpdatePass.value;
    if( !oldPass || !newPass ) return this.messageService.add({key: 'UserPageToast', severity: 'warn', summary: 'Es necesario llenar todos los campos'});
    if( !this.userService.userData?.numempleado ) return this.messageService.add({key: 'UserPageToast', severity: 'error', summary: 'Ocurrió un problema mientras se obtenian los datos del usuario'});

    this.loginService.updatePassword({empleado: this.userService.userData.numempleado, old_password: oldPass, new_password: newPass }).subscribe(data => {
      if( !data.status ) return this.messageService.add({key: 'UserPageToast', severity: 'error', summary: data.message});

      this.formUpdatePass.reset();
      return this.messageService.add({key: 'UserPageToast', severity: 'success', summary: data.message});
    });

  }

  handleUpdatePreferences(){
    if( this.formPreferences.invalid ) return this.messageService.add({key: 'UserPageToast', severity: 'warn', summary: 'Es necesario llenar todos los campos'});

    const { popupMessages, bubbleGeneral } = this.formPreferences.value;
    if(
        typeof popupMessages !== 'boolean' ||
        typeof bubbleGeneral !== 'boolean'
    ) return this.messageService.add({key: 'UserPageToast', severity: 'warn', summary: 'Es necesario llenar todos los campos'});
    
    
    this.userService.updatePreferences({ popupMessages, bubbleGeneral }).subscribe(data => {
      if( !data.status ) return this.messageService.add({key: 'UserPageToast', severity: 'error', summary: data.message});

      this.userService.userData = data.result;
      this.messageService.add({key: 'UserPageToast', severity: 'success', summary: 'Se actualizaron las preferencias del usuario'});
    });

  }


  private updatePreferences(data:UserPreferences){

    if( 
      this.userService.userData &&
      this.userService.userData.preferencias
    ){

      const newPreferences = {
        popupMessages: data.popupMessages ?? this.userService.userData.preferencias.popupMessages,
        bubbleGeneral: data.bubbleGeneral ?? this.userService.userData.preferencias.bubbleGeneral,
      }

      this.userService.userData['preferencias'] = newPreferences
    };
  }

}
