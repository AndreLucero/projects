import { Component, Input } from '@angular/core';
import { TailwindColor } from '@lib/definitions';

@Component({
  selector: 'checkbox-color',
  imports: [],
  templateUrl: './checkbox-color.html',
  styleUrl: './checkbox-color.css'
})
export class CheckboxColor {
  @Input({required:true}) color!:TailwindColor;
}
