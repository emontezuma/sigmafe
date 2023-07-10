import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }

  substractDates(dateFrom: any, dateTo: any, format: string): any {
    if (!dateFrom) {
      dateFrom = new Date();
    } else {
      try {
        dateFrom = new Date(dateFrom.replace(/-/g,'/'));
      } catch (error) {
        return "error df";
      }      
    }
    if (!dateTo) {
      dateTo = new Date();
    } else {
      try {
        dateTo = new Date(dateTo.replace(/-/g,'/'));
      } catch (error) {
        return "error dt";
      }      
    }
    let result = dateTo - dateFrom;
    if (format === "d") {
      result = Math.round(result / (1000 * 86400));
    }
    
    return result;
  }

  labelElapsedTime(dateFrom: any): string {
    if (!dateFrom) {
      return '';
    }
    
    try {
      dateFrom = new Date(dateFrom.replace(/-/g,'/'));
    } catch (error) {
      return "error df";
    }      

    const dateTo: any = new Date();
    let result = Math.round((dateTo - dateFrom) / 1000);
    if (result < 3) {
      return $localize `Justo ahora`;
    } else if (result < 10) {
      return $localize `Hace un momento...`;
    } else if (result < 30) {
      return $localize `Hace ${result} segundos`;
    } else if (result < 60) {
      return $localize `Hace menos de un minuto`;
    } else if (result < 120) {
      return $localize `Hace un minuto`;
    } else if (result < 3600) {
      return $localize `Hace ${Math.round(result / 60)} minutos`;
    } else if (result < 5400) {
      return $localize `Hace una hora`;
    } else if (result < 7200) {
      return $localize `Hace más de una hora`;
    } else if (result < 86400) {
      return $localize `Hace ${Math.round(result / 3600)} horas`;
    }
    return '';
  }

}
