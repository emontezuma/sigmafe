import { Component, Input } from '@angular/core';
import { dissolve } from '../../animations/shared.animations';

@Component({
  selector: 'app-readonly-field',
  templateUrl: './readonly-field.component.html',
  animations: [ dissolve ],
  styleUrls: ['./readonly-field.component.scss']
})
export class ReadonlyFieldComponent {
  @Input() recordId: string;
  @Input() loading: boolean;
  @Input() label: string;
  @Input() subtitle: string;
  @Input() icon: string;
  @Input() reference: string;
  @Input() labelClass: string;  
  @Input() referenceClass: string;  
  @Input() iconClass: string;  
  @Input() skeletonTheme;
  @Input() skeletonCount: string;  
  @Input() openNewTabMessage: string;   
  @Input() showGoToRecord: boolean;  
  
  constructor (    
  ) { }

// Hooks ====================
  ngOnInit(): void {
    this.skeletonTheme = this.skeletonTheme ? this.skeletonTheme : {
      height: '23px',
      marginBottom: '0px',
      backgroundColor: 'rgba(0, 0, 0, 0.075)',
      width: '90%'
    }
    this.skeletonCount = this.skeletonCount ?? "1";
    this.labelClass = this.labelClass ?? "label-description";
    this.referenceClass = this.referenceClass ?? "label-reference";
    this.iconClass = this.iconClass ?? "accordion-icon";
    this.openNewTabMessage = this.openNewTabMessage ?? $localize`Abrir este registro en una nueva ficha`;
  }
// Functions ================
  openRecordInNewTab() {
    alert('El registro es: ' + this.recordId);
  }

// End ======================
}
