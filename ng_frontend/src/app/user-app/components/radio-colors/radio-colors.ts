import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindColor } from '@lib/definitions';

@Component({
  selector: 'radio-colors',
  imports: [],
  templateUrl: './radio-colors.html',
  styles: ``,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioColors),
    multi: true
  }]
})
export class RadioColors implements ControlValueAccessor{

  tailwindColors:TailwindColor[] = ['red','yellow','blue','sky','purple','violet','green', 'pink','gray','orange','amber','cyan','emerald','indigo', 'lime','rose','slate','teal'];

  selectedValue = '';

  onChange = (_:any) => {};
  onTouched = () => {};

  select(value:string){
    this.selectedValue = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(newValue:string){
    this.selectedValue = newValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
