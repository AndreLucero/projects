import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { GeneralSpeedDial } from '@app/components/general-speed-dial/general-speed-dial';
import { UserService } from '@app/user-app/service/user-service';
import { getLvlByRole } from '@lib/utils';

@Component({
  selector: 'user-page',
  imports: [RouterLink, RouterOutlet, RouterModule, GeneralSpeedDial],
  templateUrl: './user-page.html',
  styles: ``
})
export class UserPage {
  
  constructor(
    private route:ActivatedRoute,
    public userService:UserService
  ){

    this.route.data.subscribe(d =>{
      this.userService.userData = d['userData'];
    });

  }

  validRole(){
    return getLvlByRole( this.userService.userData?.roltype ) > getLvlByRole( 'EJECUTIVO STAFF' );
  }

}
