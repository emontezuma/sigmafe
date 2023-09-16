import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { SearchBox, ShowElement, ToolbarElement, ToolbarButtons, GoTopButtonStatus, animationStatus, ButtonActions, ToolbarButtonClicked, SnackMessage, } from '../models/screen.models';
import { MatSnackBar } from "@angular/material/snack-bar";
import { DatePipe } from '@angular/common';
import { CapitalizationMethod, DatesDifference } from '../models/helpers.models';

interface buttonState {
  action?: ButtonActions;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root',
})

export class SharedService {
  private textToSearch: BehaviorSubject<SearchBox> = new BehaviorSubject<SearchBox>({ textToSearch: '', from: '' });
  search: Observable<SearchBox> = this.textToSearch.asObservable();

  private buttonActionToDo: BehaviorSubject<ToolbarButtonClicked> = new BehaviorSubject<ToolbarButtonClicked>({ action: undefined, from: '', buttonIndex: -1 });
  toolbarAction: Observable<ToolbarButtonClicked> = this.buttonActionToDo.asObservable();

  private handleButtonState: BehaviorSubject<buttonState> = new BehaviorSubject<buttonState>({ action: undefined, enabled: true });
  buttonStateChange: Observable<buttonState> = this.handleButtonState.asObservable();

  private handleSnackMessage: BehaviorSubject<SnackMessage> = new BehaviorSubject<SnackMessage>({ message: '', duration: 0, buttonText: '', icon: '', snackClass: '', buttonIcon: '' });
  snackMessage: Observable<SnackMessage> = this.handleSnackMessage.asObservable();
  
  private showSearchBox: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showSearch: Observable<ShowElement> = this.showSearchBox.asObservable();

  private showGeneralLoader: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showLoader: Observable<ShowElement> = this.showGeneralLoader.asObservable();

  private toolbar: BehaviorSubject<ToolbarElement> = new BehaviorSubject<ToolbarElement>({ from: '', toolbarClass: 'toolbar-grid', dividerClass: 'divider', show: false, buttons: [] });
  showToolbar: Observable<ToolbarElement> = this.toolbar.asObservable();

  private toolbarWidth: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  showToolbarWidth: Observable<number> = this.toolbarWidth.asObservable();

  private showGeneralProgressBar: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showProgressBar: Observable<ShowElement> = this.showGeneralProgressBar.asObservable();

  private showGeneralScrollBar: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showScrollBar: Observable<ShowElement> = this.showGeneralScrollBar.asObservable();

  private showGoTopButton: BehaviorSubject<GoTopButtonStatus> = new BehaviorSubject<GoTopButtonStatus>({ from: '', status: 'inactive' });
  showGoTop: Observable<GoTopButtonStatus> = this.showGoTopButton.asObservable();

  private routeAnimationFinished: BehaviorSubject<animationStatus> = new BehaviorSubject<animationStatus>({ toState: '', fromState: '', isFinished: false });
  isAnimationFinished: Observable<animationStatus> = this.routeAnimationFinished.asObservable();

  private pulseSecond: BehaviorSubject<boolean> = new BehaviorSubject<boolean>( false );
  pastSecond: Observable<boolean> = this.pulseSecond.asObservable();

  constructor (
    public snackBar: MatSnackBar,
    public datePipe: DatePipe,
  ) {}

// Functions ================
  setText(textToSearch: string, from: string) {
    this.textToSearch.next({ textToSearch, from });
  }

  setButtonState(action: ButtonActions, enabled: boolean) {
    this.handleButtonState.next({ action, enabled });
  }

  setToolbarClick(action: ButtonActions, from: string, buttonIndex: number) {
    this.buttonActionToDo.next({ action, from, buttonIndex });
  }

  setSearchBox(from: string, showSearchBox: boolean) {
    this.showSearchBox.next({ from, show: showSearchBox });
  }

  setGeneralLoading(from: string, showLoading: boolean) {
    this.showGeneralLoader.next({ from, show: showLoading });
  }

  setGeneralProgressBar(from: string, showProgress: boolean) {
    this.showGeneralProgressBar.next({ from, show: showProgress });
  }
  
  setToolbar(from: string, showToolbar: boolean, toolbarClass: string, dividerClass: string, buttons: ToolbarButtons[]) {
    this.toolbar.next({ from, show: showToolbar, toolbarClass, dividerClass, buttons });
  }

  setToolbarWidth(width: number) {
    this.toolbarWidth.next(width);
  }
  
  setGeneralScrollBar(from: string, showScrollBar: boolean) {
    this.showGeneralScrollBar.next({ from, show: showScrollBar });
  }

  setGoTopButton(from: string, status: string) {
    this.showGoTopButton.next({ from, status });
  }

  SetAnimationFinished(fromState: string, toState: string, isFinished: boolean) {
    this.routeAnimationFinished.next({ fromState, toState, isFinished });
  }

  setTimer() {
    const source = interval(1000);
    const subscribe = source.subscribe(val => this.pulseSecond.next(true));    
  }

  showSnackMessage(message: string, duration: number = 0, snackClass: string = 'snack-primary', buttonText: string = '', icon: string = '', buttonIcon: string = '') {
    this.handleSnackMessage.next({
      message,
      duration,
      snackClass,
      buttonText,
      icon,
      buttonIcon,
    })      
  }

  substractDates(dateFrom: any, dateTo: any, format: string): any {
    if (!dateFrom) {
      dateFrom = new Date();
    } else {
      try {
        dateFrom = new Date(dateFrom.replace(/-/g,'/'));
      } catch (error) {
        return 'error df';
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
      return 'error df';
    }      

    const dateTo: any = new Date();
    let result = Math.round((dateTo - dateFrom) / 1000);
    if (result < 3) {
      return $localize `Justo ahora`;
    } else if (result < 5) {
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

  datesDifferenceInSeconds(dateFrom: any, dateTo: any = '', type: string = 'elapsed'): DatesDifference {
    if (!dateFrom && !dateTo) {
      return {
        message: 'noDates',
        totalSeconds: 0,
        seconds: '',
        minutes: '',
        hours: '',
        days: '',
      };
    }
    
    if (!dateFrom) {
        dateFrom = new Date();
    } else {
      if (!this.isDateValid(dateFrom as any)) {
        return {
          message: 'errorInDateFrom',
          totalSeconds: 0,
          seconds: '',
          minutes: '',
          hours: '',
          days: '',
        };
      } else {
        dateFrom = new Date(dateFrom);
      }
    }
    
    if (!dateTo) {
      dateTo = new Date();
    } else {
      if (!this.isDateValid(dateTo as any)) {
        return {
          message: 'errorInDateTo',
          totalSeconds: 0,
          seconds: '',
          minutes: '',
          hours: '',
          days: '',
        };
      } else {
        dateTo = new Date(dateTo);
      }
    }

    let totalSeconds = Math.round((dateTo - dateFrom) / 1000);
    let days = Math.floor(Math.abs(totalSeconds / 86400)).toString();

    let time = Math.floor(Math.abs((totalSeconds % 86400) / 3600));
    const hours = time < 10 ? '0' + time.toString() : time.toString();

    time = Math.floor(Math.abs((totalSeconds % 3600) / 60));
    const minutes = time < 10 ? '0' + time.toString() : time.toString();

    time = Math.abs(totalSeconds % 60);
    const seconds = time < 10 ? '0' + time.toString() : time.toString();

    return {
      message: 'ok',
      totalSeconds,
      seconds,
      minutes,
      hours,
      days,
    };
  }

  isDateValid(date: any): boolean {
    if (!date) {
      return false;
    }

    if (isNaN(Date.parse(date))) {
      return false;
    }

    try {
      date = new Date(date.replace(/-/g,'/'));
    } catch (error) {      
      return false
    }

    return true;
  }

  capitalization(text: string, method: CapitalizationMethod = CapitalizationMethod.UPPERCASE): string {
    if (!text) {
      return '';
    }

    if (method === CapitalizationMethod.LOWERCASE) {
      return text.toLowerCase();
    } else if (method === CapitalizationMethod.FIRST_LETTER_WORD) {
      return text
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');      
    } else if (method === CapitalizationMethod.FIRST_LETTER_PHRASE) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    } else {
      return text.toUpperCase();
    }    
  }

  formatDate(date: string, format: string = 'yyyy/MM/dd HH:mm:ss'): string {
    if (!date || !this.isDateValid(date as any)) {
      return '';
    }

    return this.datePipe.transform(new Date(date), format).replace(/p. m./gi, 'PM').replace(/a. m./gi, 'AM');
  }

// End ======================
}
