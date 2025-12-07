import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'switch-toggle',
  imports: [],
  templateUrl: './switch-toggle.html',
  styles: ``,
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SwitchToggle),
    multi: true
  }]
})
export class SwitchToggle implements ControlValueAccessor {
  selectedValue!:boolean;
  
  onChange = (_:any) => {};
  onTouched = () => {};
  
  select(){
    this.selectedValue = !this.selectedValue
    this.onChange(this.selectedValue);
    this.onTouched();
  }

  writeValue(newValue:boolean){
    this.selectedValue = newValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
