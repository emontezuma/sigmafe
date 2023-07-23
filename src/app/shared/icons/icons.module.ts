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
      "vertical-menu",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/vertical_menu.svg")
    );
    iconRegistry.addSvgIcon(
      "menu",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/menu.svg")
    );
    iconRegistry.addSvgIcon(
      "download",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/download.svg")
    );
    iconRegistry.addSvgIcon(
      "reload",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/reload.svg")
    );
  }
}
