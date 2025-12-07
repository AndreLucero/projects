import { Component, Input } from '@angular/core';
import { UserData } from '@lib/users';

@Component({
  selector: 'user-icon',
  imports: [],
  templateUrl: './user-icon.html',
  styles: ``
})
export class UserIcon {
  @Input({required:true}) user!:UserData;
}
