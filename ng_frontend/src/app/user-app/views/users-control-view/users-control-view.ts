import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RowUserConfig } from '@app/user-app/components/row-user-config/row-user-config';
import { AllUsersService } from '@app/user-app/service/all-users-service';
import { UserService } from '@app/user-app/service/user-service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'users-control-view',
  imports: [ RowUserConfig, Toast, FormsModule],
  templateUrl: './users-control-view.html',
  styles: ``,
  providers: [ MessageService ]
})
export class UsersControlView {

  inputSearch = '';

  constructor(
    private route:ActivatedRoute,
    public allUsersService:AllUsersService,
    private messageService:MessageService,
    public userService:UserService
  ){

    this.route.data.subscribe(d => {
      this.allUsersService.allUsers = d['allUsers'];
    });

  }

  setToast( msg:{type:string, message:string} ){

    this.messageService.add({
      key: 'UserControlViewToast',
      severity: msg.type,
      summary: msg.message
    });

  }

  filterInputSearch( textToFilter:string ){
    const regex = new RegExp( this.inputSearch, 'i');
    return regex.test( textToFilter );
  }

}
