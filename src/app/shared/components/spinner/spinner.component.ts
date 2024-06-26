import { Component, Input, OnChanges } from '@angular/core';
import { Colors, SmallFont, SpinnerFonts, SpinnerLimits } from '../../models/colors.models'
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnChanges {
  @Input() diameter: number;
  @Input() value: number;
  @Input() countdown: number;
  @Input() showBackgound: boolean;
  @Input() suffix: string;
  @Input() showPrefix: boolean;
  @Input() prefix: string;
  @Input() limits: SpinnerLimits[];
  @Input() fonts: SpinnerFonts[];
  @Input() exhaustedValue: string;
  @Input() smallFont: SmallFont;
  @Input() legacy: string;
  @Input() spinnerMode: ProgressSpinnerMode = 'determinate';

// Variables ================
  metterClass: string = '';
  progressBarColor: string = Colors.green;
  valueToShow: string = '';
  previousValue: string = '';
  fontColor: string = '';
  fontSize: string = '';
  fontWeight: string = '';

  constructor () {};

  // Hooks ====================
  ngOnInit() { 
    this.suffix.trim();
  }

  ngOnChanges() {
    let selectedFontColor:string = Colors.carbon;
    let selectedBarColor:string = Colors.green;
    if (this.limits.length > 0) {
      for (let [index, limit] of this.limits.entries()) {
        if (this.value >= limit.start && this.value < limit.finish || limit.finish === 0) {
          this.metterClass = 'meter-' + (index + 1);          
          break;
        }  
      }
    } else if (!this.legacy) {
      this.metterClass = 'meter-0';      
    } else {
      this.metterClass = this.legacy;
    }
    this.progressBarColor = selectedBarColor;
    if (+this.previousValue === this.value && this.previousValue !== '') {
      return;
    }    
    let printExhaustedValue = false;
    if (this.fonts.length === 0) {
      this.fontSize = '1.5rem';
      this.fontWeight = '300';
      this.fontColor = Colors.carbon;
    } else {
      for (let font of this.fonts) {
        if (this.value >= font.start && this.value < font.finish || font.finish === 0) {
          if (font.finish === 0) {
            printExhaustedValue = true;
          }
          this.fontSize = font.size + 'rem';
          this.fontWeight = font.weight  + '';
          this.fontColor = selectedFontColor;
          break;
        }  
      }
    }
    this.valueToShow = this.countdown ? this.countdown + '' : printExhaustedValue ? this.exhaustedValue : this.value.toString();
    this.previousValue = this.value + '';
  }

// End ======================
}


