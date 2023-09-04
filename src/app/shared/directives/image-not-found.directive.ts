import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import { environment } from '../../../environments/environment';

@Directive({
  selector: '[appImageNotFound]'
})
export class ImageNotFoundDirective {
  @Input() imageByDefault: string;
  
  @HostListener('error')
  loadByDefaultImage() {
    const img = this.elementRef.nativeElement;
    img.src = this.imageByDefault || environment.imageByDefault; 
  }

  constructor (
    private elementRef: ElementRef
  ) { }
  
}
