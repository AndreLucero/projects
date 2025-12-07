import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppInformation } from '@app/home-app/home';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'card-application-preview',
  imports: [RouterLink, SkeletonModule],
  templateUrl: './card-application-preview.html',
  styles: ``
})
export class CardApplicationPreview {
  @Input({required:true}) appInformation!:AppInformation;
  
}
