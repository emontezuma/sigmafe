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
}
