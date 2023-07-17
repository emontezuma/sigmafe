import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from '@angular/material/icon';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class IconsModule { 

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon(
      "vertical_menu",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/vertical_menu.svg")
    );
    iconRegistry.addSvgIcon(
      "left_menu",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/left_menu.svg")
    );
  }
}
