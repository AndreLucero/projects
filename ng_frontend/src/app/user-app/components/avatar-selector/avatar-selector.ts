import { Component, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserService } from '@app/user-app/service/user-service';

@Component({
  selector: 'avatar-selector',
  imports: [],
  templateUrl: './avatar-selector.html',
  styles: ``,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AvatarSelector),
    multi: true
  }]
})
export class AvatarSelector implements ControlValueAccessor {

  elementSelected = false;
  selectedValue?:string;

  srcImages = [
    {src: 'avatar_1.webp'},
    {src: 'avatar_2.webp'},
    {src: 'avatar_3.png'},
    {src: 'avatar_4.png'},
    {src: 'avatar_5.png'},
    {src: 'avatar_6.png'},
    {src: 'avatar_7.svg'},
    {src: 'avatar_8.png'},
    {src: 'avatar_9.png'},
    {src: 'avatar_10.svg'},
  ]

  
  onChange = (_:any) => {};
  onTouched = () => {};

  writeValue(newValue:string){
    this.selectedValue = newValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  constructor(
    public userService:UserService
  ){}

  @HostListener('window:keydown.escape', ['$event'])
  onKeyPress(evt : Event){
    this.elementSelected = false;
  }

  setNewAvatar(src?:string){

    this.selectedValue = src;
    this.onChange(src);
    this.onTouched();

    if( this.userService.userData ){
      this.userService.userData = {
        ... this.userService.userData,
        avatar: src
      };
    }

    this.elementSelected = false;
  }
}
