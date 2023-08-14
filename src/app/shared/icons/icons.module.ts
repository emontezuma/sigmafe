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
    iconRegistry.addSvgIcon(
      "attachment",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/attachment.svg")
    );
    iconRegistry.addSvgIcon(
      "save",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/save.svg")
    );
    iconRegistry.addSvgIcon(
      "cancel",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/cancel.svg")
    );
    iconRegistry.addSvgIcon(
      "checklist",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/checklist.svg")
    );
    iconRegistry.addSvgIcon(
      "support",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/support.svg")
    );
    iconRegistry.addSvgIcon(
      "checklist-header",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/checklist_header.svg")
    );
    iconRegistry.addSvgIcon(
      "small-locked",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/small_locked.svg")
    );
    iconRegistry.addSvgIcon(
      "arrow-up",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/arrow_up.svg")
    );
    iconRegistry.addSvgIcon(
      "arrow-down",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/arrow_down.svg")
    );
    iconRegistry.addSvgIcon(
      "check",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/check.svg")
    );
    iconRegistry.addSvgIcon(
      "warn_line",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/warn_line.svg")
    );  
    iconRegistry.addSvgIcon(
      "warn_fill",
      sanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/warn_fill.svg")
    );    
  }
}
