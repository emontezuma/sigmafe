import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SearchBox, ShowElement, ToolbarElement, ToolbarButtons, GoTopButtonStatus, ScreenSizes } from '../models/screen.models';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private textToSearch: BehaviorSubject<SearchBox> = new BehaviorSubject<SearchBox>({ textToSearch: '', from: '' });
  search: Observable<SearchBox> = this.textToSearch.asObservable();

  private showSearchBox: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showSearch: Observable<ShowElement> = this.showSearchBox.asObservable();

  private showGeneralLoader: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showLoader: Observable<ShowElement> = this.showGeneralLoader.asObservable();

  private toolbar: BehaviorSubject<ToolbarElement> = new BehaviorSubject<ToolbarElement>({ from: '', show: false, size: ScreenSizes.NORMAL, buttons: [] });
  showToolbar: Observable<ToolbarElement> = this.toolbar.asObservable();

  private showGeneralProgressBar: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showProgressBar: Observable<ShowElement> = this.showGeneralProgressBar.asObservable();

  private showGeneralScrollBar: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showScrollBar: Observable<ShowElement> = this.showGeneralScrollBar.asObservable();

  private showGoTopButton: BehaviorSubject<GoTopButtonStatus> = new BehaviorSubject<GoTopButtonStatus>({ from: '', status: 'inactive' });
  showGoTop: Observable<GoTopButtonStatus> = this.showGoTopButton.asObservable();

  constructor() { }

// Functions ================
  setText(textToSearch: string, from: string) {
    this.textToSearch.next({ textToSearch, from });
  }

  setSearchBox(from: string, showSearchBox: boolean) {
    this.showSearchBox.next({ from, show: showSearchBox });
  }

  setGeneralLoading(from: string, showLoading: boolean) {
    this.showGeneralLoader.next({ from, show: showLoading });
  }

  setGeneralPreogressBar(from: string, showProgress: boolean) {
    this.showGeneralProgressBar.next({ from, show: showProgress });
  }
  
  setToolbar(from: string, showToolbar: boolean, size: ScreenSizes, buttons: ToolbarButtons[]) {
    this.toolbar.next({ from, show: showToolbar, size, buttons });
  }
  
  setGeneralScrollBar(from: string, showScrollBar: boolean) {
    this.showGeneralScrollBar.next({ from, show: showScrollBar });
  }

  setGoTopButton(from: string, status: string) {
    this.showGoTopButton.next({ from, status });
  }

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


// End ======================
}
