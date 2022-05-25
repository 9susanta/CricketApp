import { Component, Input, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-type-dropdown',
  templateUrl: './type-dropdown.component.html',
  styleUrls: ['./type-dropdown.component.css'],
})
export class TypeDropdownComponent implements ControlValueAccessor  {

  matchTypes = [
    { Id: 1, name: 'International' },
    { Id: 2, name: 'Domestic' },
    { Id: 3, name: 'Leagues' }
  ];

  @Input() cssClass:string="";
  @Input() Id:string="";

  constructor(@Self() public ngControl: NgControl) { 
    this.ngControl.valueAccessor = this;
  }
  writeValue(obj: any): void {
    
  }
  registerOnChange(fn: any): void {
    
  }
  registerOnTouched(fn: any): void {
   
  }
  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    const ctrl = absCtrl as FormControl;
    return ctrl;
  }

}
