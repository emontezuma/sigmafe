import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

import { Store } from '@ngrx/store';
import { sampleColors } from '../../shared/sample-data';
import { Colors, ColorsData } from '../../shared/models/colors.models';

import tinycolor from 'tinycolor2';
import { ApplicationModules } from '../models/screen.models';
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
  primaryColor: string = '#1e90ff'
  accentColor = '#00FF00';
  warnColor = '#FF0000';
      
  fakeColorsData: ColorsData = sampleColors;
  data$: BehaviorSubject<ColorsData> = new BehaviorSubject(sampleColors);

  constructor(
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
    document.documentElement.style.setProperty('--z-colors-status-none', colorsData?.status.none ?? Colors.none);
    document.documentElement.style.setProperty('--z-colors-page-shadow', colorsData?.page?.shadow ?? Colors.whitesmoke);
    document.documentElement.style.setProperty('--z-colors-page-fore', colorsData?.page?.fore ?? Colors.carbon);
    document.documentElement.style.setProperty('--z-colors-page-fore-contrast', colorsData?.page?.foreContrast ?? Colors.white);

    // Computed colors
    let colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-200');
    document.documentElement.style.setProperty('--z-colors-page-button-border', colorsData?.page?.buttonBorderColor ?? colorToUse);    
    document.documentElement.style.setProperty('--z-colors-page-button-disabled-border', colorsData?.page?.buttonDisabledBorderColor ?? Colors.lightgrey);
    document.documentElement.style.setProperty('--z-colors-page-primary', colorsData?.page?.palettePrimaryColor ?? Colors.primary);    
    document.documentElement.style.setProperty('--z-colors-page-disabled-color', colorsData?.page?.disabled ?? Colors.gray);    
    document.documentElement.style.setProperty('--z-colors-page-border', colorsData?.page?.border ?? Colors.silver);  
    document.documentElement.style.setProperty('--z-colors-page-card-background-color', colorsData?.page?.cardBackgroundColor ?? Colors.whitesmoke);
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-50');
    document.documentElement.style.setProperty('--z-colors-page-background-color', colorsData?.page?.backgroundColor ?? colorToUse);
    
    // Buttons
    colorToUse = document.documentElement.style.getPropertyValue('--theme-primary-100');
    document.documentElement.style.setProperty('--z-colors-page-button-normal-background-color', colorsData.page?.buttonNormalBackgroundColor ?? colorToUse);
    document.documentElement.style.setProperty('--z-colors-page-button-normal-fore-color', colorsData?.page?.fore ?? Colors.carbon);
    
    //Footer
    colorToUse = document.documentElement.style.getPropertyValue('--theme-accent-contrast-500');
    document.documentElement.style.setProperty('--z-colors-page-footer-fore-color', colorsData.page?.footerFore ?? colorToUse);
    colorToUse = document.documentElement.style.getPropertyValue('--theme-accent-500');
    document.documentElement.style.setProperty('--z-colors-page-footer-background-color', colorsData.page?.footerBackground ?? colorToUse);

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
      color.darkContrast ? 'rgba(black, 0.87)' : 'white'
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
  const c = tinycolor(value);
  return {
    name: name,
    hex: c.toHexString(),
    darkContrast: c.isLight()
  };
}

function componentToHex(c: any) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: any, g: any, b: any) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex: any) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}
// End ======================
