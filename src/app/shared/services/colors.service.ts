import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

import { Store } from '@ngrx/store';
import { sampleColors } from '../../shared/sample-data';
import { Colors, ColorsData } from '../../shared/models/colors.models';

import tinycolor from 'tinycolor2';
import { AppState } from 'src/app/state/app.state';
import { selectColorsData } from 'src/app/state/selectors/colors.selectors';

export interface Color {
  name: string;
  hex: string;
  darkContrast: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

// Variables ===============
  primaryColor: string = '#1D3649';
  accentColor = '#1D3649';
  warnColor = '#FF0000';
      
  fakeColorsData: ColorsData = sampleColors;
  data$: BehaviorSubject<ColorsData> = new BehaviorSubject(sampleColors);

  constructor (
    private store: Store<AppState>,
  ) {}

// Functions ================
  setColors() {
    this.store.select(selectColorsData).subscribe( colorsData => {
      updateTheme(computeColors(colorsData.page?.palettePrimaryColor ?? this.primaryColor), 'primary');
      updateTheme(computeColors(colorsData.page?.paletteWarnColor ?? this.warnColor), 'warn');
      updateTheme(computeColors(colorsData.page?.paletteAccentColor ?? this.accentColor), 'accent');
      this.fillVariables(colorsData);
    });
  };
  
  saveSpecificColor(variableName: string, value: string) {
    document.documentElement.style.setProperty(variableName, value);
  }

  fillVariables(colorsData: ColorsData) {
    document.documentElement.style.setProperty('--z-colors-status-ok', colorsData?.status.ok ?? Colors.green);
    document.documentElement.style.setProperty('--z-colors-status-warn', colorsData?.status.warn ?? Colors.orange);
    document.documentElement.style.setProperty('--z-colors-status-alarm', colorsData?.status.alarm ?? Colors.orangered);
    document.documentElement.style.setProperty('--z-colors-status-ok-fore', colorsData?.status.okFore ?? Colors.white);
    document.documentElement.style.setProperty('--z-colors-status-warn-fore', colorsData?.status.warnFore ?? Colors.white);
    document.documentElement.style.setProperty('--z-colors-status-alarm-fore', colorsData?.status.alarmFore ?? Colors.white);
    document.documentElement.style.setProperty('--z-colors-status-none', colorsData?.status.none ?? Colors.none);
    // TODO la sombra debe calcularse    
    document.documentElement.style.setProperty('--theme-primary-500', colorsData?.page?.palettePrimaryColor ?? Colors.primary);    
    document.documentElement.style.setProperty('--z-colors-page-disabled-color', colorsData?.page?.disabled ?? Colors.gray);        
        
    // Computed colors    
    let colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-A200');
    document.documentElement.style.setProperty('--z-colors-page-card-background-color', colorsData?.page?.cardBackgroundColor ?? colorToUse);    

    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-contrast-A200');
    document.documentElement.style.setProperty('--z-colors-page-card-fore', colorsData?.page?.cardForeColor ?? colorToUse);

    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-contrast-500');
    document.documentElement.style.setProperty('--z-colors-page-fore', colorsData?.page?.foreColor ?? colorToUse);                        
    
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-200');
    document.documentElement.style.setProperty('--z-colors-page-button-border', colorsData?.page?.buttonBorderColor ?? colorToUse);
    document.documentElement.style.setProperty('--z-colors-page-card-disabled-background-color', colorsData?.page?.cardDisabledBackgoundColor ?? colorToUse);
    
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-400');
    document.documentElement.style.setProperty('--z-colors-page-card-border', colorsData?.page?.cardBorderColor ?? colorToUse);
    document.documentElement.style.setProperty('--z-colors-page-border', colorsData?.page?.border ?? colorToUse);
    document.documentElement.style.setProperty('--z-colors-page-card-disabled-border-color', colorsData?.page?.cardDisabledBorderColor ?? colorToUse);
    document.documentElement.style.setProperty('--z-colors-page-card-disabled-fore', colorsData?.page?.cardDisabledForeColor ?? colorToUse);

    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-100');
    document.documentElement.style.setProperty('--z-colors-page-background-color', colorsData?.page?.backgroundColor ?? colorToUse);
    
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-300');
    document.documentElement.style.setProperty('--z-colors-page-tab-background-color', colorsData?.page?.tabBackgroundColor ?? colorToUse);
    document.documentElement.style.setProperty('--z-colors-page-button-disabled-border', colorsData?.page?.buttonDisabledBorderColor ?? colorToUse);    
    document.documentElement.style.setProperty('--z-colors-page-button-disabled-fore', colorsData?.page?.buttonDisabledFore ?? colorToUse);        
    
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-500');
    document.documentElement.style.setProperty('--z-colors-page-tab-border-color', colorsData?.page?.tabBorderColor ?? colorToUse);    
    
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-700');
    document.documentElement.style.setProperty('--z-colors-page-shadow', colorsData?.page?.shadow ?? colorToUse);
    
    // Buttons
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-100');
    document.documentElement.style.setProperty('--z-colors-page-button-normal-background-color', colorsData.page?.buttonNormalBackgroundColor ?? colorToUse);
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-700');
    document.documentElement.style.setProperty('--z-colors-page-button-normal-fore-color', colorsData?.page?.buttonNormalFore ?? colorToUse);
    document.documentElement.style.setProperty('--z-colors-page-button-normal-border-color', colorsData?.page?.buttonNormalBorderColor ?? colorToUse);
    document.documentElement.style.setProperty('--z-colors-page-button-disabled-background-color', colorsData?.page?.buttonDisabledBackgroundColor ?? Colors.none);    
    
    //Footer
    colorToUse = document.documentElement.style.getPropertyValue('--theme-accent-contrast-500');
    document.documentElement.style.setProperty('--z-colors-page-footer-fore-color', colorsData.page?.footerForeColor ?? colorToUse);
    colorToUse = document.documentElement.style.getPropertyValue('--theme-accent-500');
    document.documentElement.style.setProperty('--z-colors-page-footer-background-color', colorsData.page?.footerBackground ?? colorToUse);

    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-contrast-300');
    document.documentElement.style.setProperty('--z-colors-page-tab-fore', colorsData?.page?.tabForeColor ?? colorToUse);
    
    //Tables
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-300');    
    document.documentElement.style.setProperty('--z-colors-table-header-background-color', colorsData?.page?.tableHeaderBackgroundColor ?? colorToUse);
    document.documentElement.style.setProperty('--z-colors-paginator-background-color', colorsData?.page?.tablePaginatorBackgroundColor ?? colorToUse);
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-contrast-500');
    document.documentElement.style.setProperty('--z-colors-table-header-fore-color', colorsData?.page?.tableHeaderForeColor ?? colorToUse);
    document.documentElement.style.setProperty('--z-colors-paginator-fore-color', colorsData?.page?.tablePaginatorForeColor ?? colorToUse);
    

    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-100');        
    document.documentElement.style.setProperty('--z-colors-table-even-background-color', colorsData?.page?.tableRowEvenBackgroundColor ?? colorToUse);

    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-50');
    document.documentElement.style.setProperty('--z-colors-table-odd-background-color', colorsData?.page?.tableRowOddBackgroundColor ?? colorToUse);
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-900');
    document.documentElement.style.setProperty('--z-colors-table-row-fore-color', colorsData?.page?.tableRowForeColor ?? colorToUse);
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-400');
    document.documentElement.style.setProperty('--z-colors-table-border-color', colorsData?.page?.tableBorderColor ?? colorToUse);
    
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-100');
    document.documentElement.style.setProperty('--z-colors-table-hover-background-color', colorsData?.page?.tableHoverBackgroundColor ?? colorToUse);
        
    document.documentElement.style.setProperty('--z-colors-required-fore-color', colorsData?.page?.requiredForeColor ?? Colors.orangered);
    document.documentElement.style.setProperty('--z-colors-required-background-color', colorsData?.page?.requiredBackgroundColor ?? Colors.white);

    document.documentElement.style.setProperty('--z-colors-error-fore-color', colorsData?.page?.errorForeColor ?? Colors.orangered);
    document.documentElement.style.setProperty('--z-colors-error-background-color', colorsData?.page?.errorBackgroundColor ?? Colors.white);
    document.documentElement.style.setProperty('--z-colors-error-border-color', colorsData?.page?.errorBorderColor ?? Colors.orangered);        

    // Custom colors
    document.documentElement.style.setProperty('--z-colors-white', Colors.white);    
    document.documentElement.style.setProperty('--z-colors-orange', Colors.orange);    
    document.documentElement.style.setProperty('--z-colors-carbon', Colors.carbon);    
    document.documentElement.style.setProperty('--z-colors-blue', Colors.blue);    
    document.documentElement.style.setProperty('--z-colors-orangered', Colors.orangered);    
    document.documentElement.style.setProperty('--z-colors-green', Colors.green);    
    document.documentElement.style.setProperty('--z-colors-black', Colors.black);    
    document.documentElement.style.setProperty('--z-colors-red', Colors.red);
    document.documentElement.style.setProperty('--z-colors-dodgerblue', Colors.dodgerblue); 
    document.documentElement.style.setProperty('--z-colors-none', Colors.none);
    document.documentElement.style.setProperty('--z-colors-lightgrey', Colors.lightgrey);
    document.documentElement.style.setProperty('--z-colors-gray', Colors.gray);

    // Colors needed in RGB to apply some alpha gradient
    document.documentElement.style.setProperty('--z-colors-primary-rgb', hexToRgb(this.primaryColor));
    document.documentElement.style.setProperty('--z-colors-warn-rgb', hexToRgb(this.warnColor));    
    document.documentElement.style.setProperty('--z-colors-accent-rgb', hexToRgb(this.accentColor));    
  }    

  getSettingsData(): Observable<ColorsData> {
    return of(this.fakeColorsData).pipe(
      delay(1500)
    );
  }
}

// Outer functions
function updateTheme(colors: Color[], theme: string) {
  colors.forEach(color => {
    document.documentElement.style.setProperty(
      `--theme-${theme}-${color.name}`,
      color.hex
    );
    document.documentElement.style.setProperty(
      `--theme-${theme}-contrast-${color.name}`,
      color.darkContrast ? 'rgba(0, 0, 0, 0.87)' : 'white'
    );
  });
}

function computeColors(hex: string): Color[] {
  return [
    getColorObject(tinycolor(hex).lighten(52), '50'),
    getColorObject(tinycolor(hex).lighten(37), '100'),
    getColorObject(tinycolor(hex).lighten(26), '200'),
    getColorObject(tinycolor(hex).lighten(12), '300'),
    getColorObject(tinycolor(hex).lighten(6), '400'),
    getColorObject(tinycolor(hex), '500'),
    getColorObject(tinycolor(hex).darken(6), '600'),
    getColorObject(tinycolor(hex).darken(12), '700'),
    getColorObject(tinycolor(hex).darken(18), '800'),
    getColorObject(tinycolor(hex).darken(24), '900'),
    getColorObject(tinycolor(hex).lighten(50).saturate(30), 'A100'),
    getColorObject(tinycolor(hex).lighten(30).saturate(30), 'A200'),
    getColorObject(tinycolor(hex).lighten(10).saturate(15), 'A400'),
    getColorObject(tinycolor(hex).lighten(5).saturate(5), 'A700')
  ];
}

function getColorObject(value: any, name: string): Color {
  return {
    name: name,
    hex: value.toHexString(),
    darkContrast: value.isLight(),
  };
}

function hexToRgb(hex: any) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}
// End ======================
