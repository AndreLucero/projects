import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@app/login-app/service/login-service';

import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'login-view-2',
  imports: [ ReactiveFormsModule, Dialog, Toast ],
  templateUrl: './login-view.html',
  styles: `
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `,
  providers: [MessageService]
})
export class LoginView {
  private fromPage;

  panelLoginActive = true;
  dialogVisible = false;

  formLogin = new FormGroup({
    empleado: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    password: new FormControl('', [Validators.required])
  });

  formSignUp = new FormGroup({
    empleado: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  formUpdatePass = new FormGroup({
    empleado: new FormControl('', [Validators.required]),
    oldPass: new FormControl('', [Validators.required]),
    newPass: new FormControl('', [Validators.required])
  });


  constructor(
    private loginService:LoginService,
    private messageService:MessageService,
    private router:Router,
    private route:ActivatedRoute
  ){
    if( route.snapshot.queryParams ) this.fromPage = route.snapshot.queryParams['fromPage'];
  }

  submitLogin(){
    if( this.formLogin.invalid ){
      this.messageService.add({ key: 'loginToastKey', severity: 'error', summary: 'Es necesario llenar todos los campos' });
      return;
    };

    let {empleado, password} = this.formLogin.value
    if( typeof empleado !== 'number' || !password ){
      this.messageService.add({ key: 'loginToastKey', severity: 'error', summary: 'Es necesario llenar todos los campos' });
      return;
    }

    this.callToLogin({empleado, password});

  }

  submitSignUp(){

    if( this.formSignUp.invalid ){
      this.messageService.add({ key: 'loginToastKey', severity: 'error', summary: 'Es necesario llenar todos los campos' });
      return;
    }

    let {empleado, nombre, password} = this.formSignUp.value;
    if( typeof empleado !== 'number' ||
        !nombre ||
        !password
    ){
      this.messageService.add({ key: 'loginToastKey', severity: 'error', summary: 'Es necesario llenar todos los campos' });
      return;
    }

    this.loginService.createUser({nombre, empleado, password}).subscribe({
      next: data => {
        if( data.status ){
          this.messageService.add({ key: 'loginToastKey', severity: 'success', summary: 'Se creó el usuario' });
          this.formSignUp.reset();
          this.callToLogin({empleado, password});
        }else{
          this.messageService.add({ key: 'loginToastKey', severity: 'error', summary: data.message });
        }
      }
    })
  }

  submitUpdatePass(){
    const{ empleado, oldPass, newPass } = this.formUpdatePass.value
    
    if( this.formUpdatePass.invalid ||
        typeof empleado !== 'number' ||
        !oldPass || !newPass
    ){
      this.messageService.add({ key: 'loginToastKey', severity: 'error', summary: 'Es necesario llenar todos los campos' });
      return;
    }

    this.loginService.updatePassword({ empleado, old_password:oldPass, new_password:newPass }).subscribe({
      next: data => {
        if( data.status ){
          this.messageService.add({key: 'loginToastKey', severity: 'success', summary: 'Se actualizó la contraseña'});
          this.callToLogin({empleado, password: newPass})
          this.cancelUpdatePass();
        }else{
          this.messageService.add({key: 'loginToastKey', severity: 'error', summary: data.message});
        }
      }
    });

  }
  
  cancelUpdatePass(){
    this.formUpdatePass.reset();
    this.dialogVisible = false;
  }

  private callToLogin({empleado, password} : {empleado:number, password:string}){
    if( typeof empleado !== 'number' || !password ) return;

    this.loginService.login( {empleado, password} ).subscribe({
      next: data => {
        if( data.status ){
          this.messageService.add({ key: 'loginToastKey', severity: 'success', summary: 'Se inició sesión con éxito' });

          if( this.fromPage ){

            this.messageService.add({ key: 'loginToastKey', severity: 'success', summary: 'Se redireccionará a la aplicación que estabas consultando', life: 2500});
            setTimeout(() => this.router.navigateByUrl( this.fromPage ) , 2500);

          }

        }else{
          this.messageService.add({ key: 'loginToastKey', severity: 'error', summary: data.message });
        }
      }
    });

  }

}
