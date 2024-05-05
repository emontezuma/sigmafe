import { ElementRef } from '@angular/core';
import { ImageNotFoundDirective } from './image-not-found.directive';

describe('ImageNotFoundDirective', () => {
  it('should create an instance', () => {
    const directive new ImageNotFoundDirective(null);
    expect(directive).toBeTruthy();
  });
});
