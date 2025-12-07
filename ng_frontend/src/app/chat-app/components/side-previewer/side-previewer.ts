import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardPreviewer } from '../card-previewer/card-previewer';
import { ChatService } from '@app/chat-app/service/chat-service';

@Component({
  selector: 'side-previewer',
  imports: [ FormsModule, CardPreviewer],
  templateUrl: './side-previewer.html',
  styles: ``
})
export class SidePreviewer implements OnChanges{

  inputSearch = '';

  constructor(
    public chatService:ChatService
  ){}

  filterInputSearch( conversationName:string ){
    const regex = new RegExp( this.inputSearch, 'i');
    return regex.test( conversationName );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('algo cambio');
  }

}
