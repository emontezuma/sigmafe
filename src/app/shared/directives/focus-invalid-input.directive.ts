import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[focusInvalidInput]'
})
export class FocusInvalidInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener('ngSubmit')
  onFormSubmit() {
    console.log('entro aqui');
    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');
    console.log(invalidControl);
    if (invalidControl) {
      invalidControl.focus();
    }
  }
}