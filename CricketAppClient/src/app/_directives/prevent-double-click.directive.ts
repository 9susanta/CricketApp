import { Directive, ElementRef, HostListener } from '@angular/core';
const DISABLE_TIME = 5000;
@Directive({
  selector: '[appPreventDoubleClick]'
})
export class PreventDoubleClickDirective {

  constructor(private elementRef: ElementRef) { }
        @HostListener('click', ['$event'])
        clickEvent() {
            this.elementRef.nativeElement.parentElement.classList.add('ctrl-disable');
            setTimeout(() =>{ 
              this.elementRef.nativeElement.parentElement.classList.remove('ctrl-disable')
            }, DISABLE_TIME); 
        }
}
