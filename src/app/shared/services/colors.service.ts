import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

import { sampleColors } from '../../shared/sample-data';
import { Colors, ColorsData } from '../../shared/models/colors.models';

import tinycolor from 'tinycolor2';
import { ApplicationModules } from '../models/screen.models';
import { ColorVariable } from '../models/colors.models';

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
  primaryColor = '#1fc103';
  accentColor = '#0e67cc';
  warnColor = '#FF0000';
  primaryColorPalette: Color[] = [];
  accentColorPalette: Color[] = [];
  warnColorPalette: Color[] = [];
  fakeColorsData: ColorsData = sampleColors;
  data$: BehaviorSubject<ColorsData> = new BehaviorSubject(sampleColors);

  constructor() {
    this.savePrimaryColor();
    this.saveAccentColor();
    this.saveWarnColor();
  }

// Functions ================
  savePrimaryColor() {
    this.primaryColorPalette = computeColors(this.primaryColor);
    updateTheme(this.primaryColorPalette, 'primary');
  }

  saveAccentColor() {
    this.accentColorPalette = computeColors(this.accentColor);
    updateTheme(this.accentColorPalette, 'accent');
  }

  saveWarnColor() {
    this.warnColorPalette = computeColors(this.warnColor);
    updateTheme(this.warnColorPalette, 'warn');
  }

  saveOtherColors() {
    this.accentColorPalette = computeColors(this.warnColor);
    updateTheme(this.warnColorPalette, 'warn');
  }

  saveSpecificColor(variableName: string, value: string) {
    document.documentElement.style.setProperty(variableName, value);
  }

  setColors(module: ApplicationModules, colorsData: ColorsData) {
    document.documentElement.style.setProperty('--z-status-ok', colorsData?.status.ok ?? Colors.GREEN);
    document.documentElement.style.setProperty('--z-status-warn', colorsData?.status.warn ?? Colors.ORANGE);
    document.documentElement.style.setProperty('--z-status-alarm', colorsData?.status.alarm ?? Colors.REDORANGE);
    document.documentElement.style.setProperty('--z-status-none', colorsData?.status.none ?? Colors.NONE);
    document.documentElement.style.setProperty('--z-page-shadow', colorsData?.page.shadow ?? Colors.GRAY);
    document.documentElement.style.setProperty('--z-fore', colorsData?.page.fore ?? Colors.CARBON);
    document.documentElement.style.setProperty('--z-fore-contrast', colorsData?.page.foreContrast ?? Colors.WHITE);
    document.documentElement.style.setProperty('--z-button-border', colorsData?.page.buttonBorderColor ?? Colors.SILVER);    
    document.documentElement.style.setProperty('--z-primary', colorsData?.page.primary ?? Colors.GREEN);    
  }    

  getSettingsData(): Observable<ColorsData> {
    return of(this.fakeColorsData).pipe(
      delay(1500)
    );
  }
}

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
// End ======================
