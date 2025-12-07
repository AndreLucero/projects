import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AvatarSelector } from '@app/user-app/components/avatar-selector/avatar-selector';
import { RadioColors } from '@app/user-app/components/radio-colors/radio-colors';
import { UserService } from '@app/user-app/service/user-service';
import { TailwindColor } from '@lib/definitions';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'profile-view',
  imports: [RadioColors, ReactiveFormsModule, RouterLink, Toast, AvatarSelector],
  templateUrl: './profile-view.html',
  styles: ``,
  providers: [ MessageService ]
})
export class ProfileView {

  userColor?:TailwindColor;

  formUpdateUser = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    alias: new FormControl('', [Validators.maxLength(2), Validators.minLength(2)]),
    color: new FormControl('', [Validators.required]),
    avatar: new FormControl('')
  });

  constructor(
    private route:ActivatedRoute,
    public userService:UserService,
    private messageService:MessageService
  ){
    this.route.parent?.data.subscribe(d => {
      if( !this.userService.userData ) this.userService.userData = d['userData'];
    });

    this.formUpdateUser.patchValue({
      nombre: this.userService.userData?.nombre,
      alias: this.userService.userData?.alias,
      color: this.userService.userData?.color,
      avatar: this.userService.userData?.avatar
    })

    this.setFormListeners();

  }

  setFormListeners(){

    this.formUpdateUser.get('color')?.valueChanges.subscribe(color => {
      if( color  && this.userService.userData ){
        this.userService.userData = {
          ... this.userService.userData,
          color: (color as TailwindColor)
        }
      }
    });

    this.formUpdateUser.get('alias')?.valueChanges.subscribe(alias => {
      if( alias && this.userService.userData ){
        this.userService.userData = {
          ... this.userService.userData,
          alias
        }
      }
    });

    this.formUpdateUser.get('nombre')?.valueChanges.subscribe(nombre => {
      if( nombre && this.userService.userData ){
        this.userService.userData = {
          ... this.userService.userData,
          nombre
        }
      }
    });

  }

  aliasToUpperCase(){
    const {alias} = this.formUpdateUser.value;
    if( !alias ) return;

    this.formUpdateUser.get('alias')?.setValue( alias.toUpperCase() )
  }
  
  handleSubmitUpdateUser(){
    const dataAlias = this.formUpdateUser.get('alias');
    if( dataAlias?.errors && dataAlias.errors['minlength'] ) return this.messageService.add({key: 'UserProfileViewToast', severity: 'warn', summary: 'El alias debe de contener 2 caracteres'});

    if( this.formUpdateUser.invalid ) return this.messageService.add({key: 'UserProfileViewToast', severity: 'warn', summary: 'Es necesario que todos los campos esten llenos'});
    
    const {nombre, alias, color, avatar} = this.formUpdateUser.value;
    if( !nombre || !alias || !color ) return this.messageService.add({key: 'UserProfileViewToast', severity: 'warn', summary: 'Es necesario que todos los campos esten llenos'});
    
    this.userService.updateUser({nombre, alias, color, avatar }).subscribe(data => {
      if( !data.status ) return this.messageService.add({key: 'UserProfileViewToast', severity: 'error', summary: data.message});
      
      this.userService.userData = data.result;
      return this.messageService.add({key: 'UserProfileViewToast', severity: 'success', summary: 'Se actualizó la información con éxito'});
    });

  }

}
