import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { SearchBox, ShowElement, ToolbarControl, ToolbarElement, GoTopButtonStatus, AnimationStatus, ButtonActions, ToolbarButtonClicked, SnackMessage, ButtonState, } from '../models/screen.models';
import { DatePipe } from '@angular/common';
import { CapitalizationMethod, DatesDifference, RecordStatus } from '../models/helpers.models';
import { GET_HARDCODED_VALUES, GET_LANGUAGES_LAZY_LOADING, GET_MOLDS } from '../../graphql/graphql.queries';
import { Apollo } from 'apollo-angular';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { AppState, updateMoldsHitsData } from 'src/app/state';
import { GqlParameters } from '../models';

@Injectable({
  providedIn: 'root',
})

export class SharedService {
  private searchBehaviorSubject: BehaviorSubject<SearchBox> = new BehaviorSubject<SearchBox>({ textToSearch: '', from: '' });
  search: Observable<SearchBox> = this.searchBehaviorSubject.asObservable();

  private toolbarActionBehaviorSubject: BehaviorSubject<ToolbarButtonClicked> = new BehaviorSubject<ToolbarButtonClicked>({ 
    action: undefined,
    from: '',
    buttonIndex: -1,
    field: ''
  });
  toolbarAction: Observable<ToolbarButtonClicked> = this.toolbarActionBehaviorSubject.asObservable();

  private buttonStateChangeBehaviorSubject: BehaviorSubject<ButtonState> = new BehaviorSubject<ButtonState>({ action: undefined, enabled: true });
  buttonStateChange: Observable<ButtonState> = this.buttonStateChangeBehaviorSubject.asObservable();

  private snackMessageBehaviorSubject: BehaviorSubject<SnackMessage> = new BehaviorSubject<SnackMessage>({ 
    message: '',
    duration: 0,
    buttonText: '',
    icon: '',
    snackClass: '',
    buttonIcon: '',
    showProgressBar: true,
  });
  snackMessage: Observable<SnackMessage> = this.snackMessageBehaviorSubject.asObservable();
  
  private showSearchBehaviorSubject: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showSearch: Observable<ShowElement> = this.showSearchBehaviorSubject.asObservable();

  private showLoaderBehaviorSubject: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showLoader: Observable<ShowElement> = this.showLoaderBehaviorSubject.asObservable();

  private toolbarBehaviorSubject: BehaviorSubject<ToolbarControl> = new BehaviorSubject<ToolbarControl>({ 
    from: '',
    toolbarClass: 'toolbar-grid',
    dividerClass: 'divider',
    show: false,
    showSpinner: false,
    elements: [],
    alignment: 'right',
   });
  showToolbar: Observable<ToolbarControl> = this.toolbarBehaviorSubject.asObservable();

  private toolbarAnimationFinishedBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>( false );
  toolbarAnimationFinished: Observable<boolean> = this.toolbarAnimationFinishedBehaviorSubject.asObservable();

  private showToolbarWidthBehaviorSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  showToolbarWidth: Observable<number> = this.showToolbarWidthBehaviorSubject.asObservable();

  private allHeightBehaviorSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  getAllHeight: Observable<number> = this.allHeightBehaviorSubject.asObservable();


  private showProgressBarBehaviorSubject: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showProgressBar: Observable<ShowElement> = this.showProgressBarBehaviorSubject.asObservable();

  private showScrollBarBehaviorSubject: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showScrollBar: Observable<ShowElement> = this.showScrollBarBehaviorSubject.asObservable();

  private showGoTopBehaviorSubject: BehaviorSubject<GoTopButtonStatus> = new BehaviorSubject<GoTopButtonStatus>({ from: '', status: 'inactive' });
  showGoTop: Observable<GoTopButtonStatus> = this.showGoTopBehaviorSubject.asObservable();

  private isAnimationFinishedBehaviorSubject: BehaviorSubject<AnimationStatus> = new BehaviorSubject<AnimationStatus>({ toState: '', fromState: '', isFinished: false });
  isAnimationFinished: Observable<AnimationStatus> = this.isAnimationFinishedBehaviorSubject.asObservable();

  private pastSecondBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>( false );
  pastSecond: Observable<boolean> = this.pastSecondBehaviorSubject.asObservable();

  private timeBehaviorSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  timeInterval: Observable<number> = this.timeBehaviorSubject.asObservable();

  private stopTimerBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>( false );
  stopTimer: Observable<boolean> = this.stopTimerBehaviorSubject.asObservable();

  private timeCompletedBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>( false );
  timeCompleted: Observable<boolean> = this.timeCompletedBehaviorSubject.asObservable();
  
  private scrollbarInToolbarBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>( false );
  scrollbarInToolbar: Observable<boolean> = this.scrollbarInToolbarBehaviorSubject.asObservable();

  constructor (    
    public _datePipe: DatePipe,
    private _apollo: Apollo,
    private _store: Store<AppState>,
  ) {}

// Functions ================
  setText(textToSearch: string, from: string) {
    this.searchBehaviorSubject.next({ textToSearch, from });
  }

  setButtonState(action: ButtonActions, enabled: boolean) {
    this.buttonStateChangeBehaviorSubject.next({ action, enabled });
  }

  setToolbarClick(action: ButtonActions, from: string, buttonIndex: number, field: string, ) {
    this.toolbarActionBehaviorSubject.next({ action, from, buttonIndex, field });
  }

  setSearchBox(from: string, showSearchBox: boolean) {
    this.showSearchBehaviorSubject.next({ from, show: showSearchBox });
  }

  setGeneralLoading(from: string, showLoading: boolean) {
    this.showLoaderBehaviorSubject.next({ from, show: showLoading });
  }

  setGeneralProgressBar(from: string, showProgress: boolean) {
    this.showProgressBarBehaviorSubject.next({ from, show: showProgress });
  }
  
  setToolbar(toolbarControl: ToolbarControl) {
    this.toolbarBehaviorSubject.next(toolbarControl);
  }

  setToolbarAnimationFinished(toolbarAnimationFinished: boolean) {
    this.toolbarAnimationFinishedBehaviorSubject.next(toolbarAnimationFinished);
  }

  setToolbarWidth(width: number) {
    this.showToolbarWidthBehaviorSubject.next(width);
  }

  setAllHeight(allHeight: number) {
    this.allHeightBehaviorSubject.next(allHeight);
  }
  
  setGeneralScrollBar(from: string, showScrollBar: boolean) {
    this.showScrollBarBehaviorSubject.next({ from, show: showScrollBar });
  }

  setGoTopButton(from: string, status: string) {
    this.showGoTopBehaviorSubject.next({ from, status });
  }

  SetAnimationFinished(fromState: string, toState: string, isFinished: boolean) {
    this.isAnimationFinishedBehaviorSubject.next({ fromState, toState, isFinished });
  }

  setTimer() {
    const source = interval(1000);
    const subscribe = source.subscribe(val => this.pastSecondBehaviorSubject.next(true));    
  }

  setToolbarTime(interval: number) {
    this.timeBehaviorSubject.next(interval);
  }

  setToolbarStopTimer(stopTimer: boolean) {
    this.stopTimerBehaviorSubject.next(stopTimer);
  }

  setTimeCompleted(timeCompleted: boolean) {
    this.timeCompletedBehaviorSubject.next(timeCompleted);
  }

  setScrollbarInToolbar(showScrollBar: boolean) {
    this.scrollbarInToolbarBehaviorSubject.next(showScrollBar);
  }

  showSnackMessage(snackMessage: SnackMessage) {
    this.snackMessageBehaviorSubject.next(snackMessage)      
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

  labelElapsedTime(date: any): string {
    if (!date) {
      return '';
    }
    
    let dateFrom: number = 0; 
    try {
      const dateConverted = new Date(date).toString() + ' UTC';
      dateFrom = Date.parse(dateConverted);
      
    } catch (error) {
      try {

      } catch (error) {
        dateFrom = Date.parse(new Date(date.replace(/-/g,'/')).toString());
        return 'error df';
      }      
    }      

    const dateTo: number = Date.parse(new Date().toString());
    let result = Math.round((dateTo - dateFrom) / 1000);
    if (result < 3) {
      return $localize `Justo ahora`;
    } else if (result < 5) {
      return $localize `Hace un momento...`;
    } else if (result < 45) {
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
    return this.formatDate(new Date(dateFrom).toString(), 'EEEE, YYYY-MMM-dd HH:mm:ss');
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

  formatDate(date: string | any, format: string = 'yyyy/MM/dd HH:mm:ss'): string {
    // if (!date || !this.isDateValid(date as any)) {
    if (!date) {
      return '';
    }
    
    return this._datePipe.transform(new Date(date), format).replace(/p. m./gi, 'PM').replace(/a. m./gi, 'AM');
  }

  lookIntoObject(object: any, cad: string): boolean {
    for (let key in object) {
      if (object[key]) {
        if (typeof object[key] === 'object') {
          const objectMatch = this.lookIntoObject(object[key], cad);
          if (objectMatch) return true;
        } else {
          const value = object[key]?.toString();
          if (value?.toLowerCase().includes(cad.toLowerCase())) {
            return true;
          }        
        }
      }
    }
    return false;
  }

  filterObject(dataToFilter: any[], cad: string): any[] {    
    if (!cad) {
      return dataToFilter;
    }
    return dataToFilter.filter(item => this.lookIntoObject(item, cad));    
  }

  connectToSocket(): void {
    const host = `${environment.webSocketAddress}/moldhub`; // SET THIS TO YOUR SERVER
    try {
      let socket = new WebSocket(host);
      socket.onopen  = (msg) => { 
        socket.send('{ \"protocol\": \"json\", \"version\": 1 }\u001e');         
      };
      socket.onmessage = (socketObject: any) => {
        if (socketObject?.data) {
          const data = JSON.parse(socketObject?.data.replace("\u001e", ""));          
          if (data?.arguments?.length > 0) {
            if (data?.target === 'ReceiveMold') {
              console.log(data?.arguments[0]);
              this._store.dispatch(updateMoldsHitsData({ hitMold: data?.arguments[0] }));
            }
          }
        }
        
      };
      socket.onclose = (msg) => { 
      };     
    }
    catch(ex){ 
      console.log(ex); 
    }
        
  }

  convertUtcTolocal(dateUtc: string): Date | string {
    if (!dateUtc || dateUtc?.trim() === '') {
      return null;
    }
    
    try {
      const dateConverted = new Date(Date.parse(new Date(dateUtc).toString() + ' UTC'));
      return dateConverted;

    } catch (error) {      
        return null;
    }
  }

  actionCancelledByTheUser() {
    const message = $localize`Acción cancelada por el usuario`;
    this.showSnackMessage({
      message,
      snackClass: 'snack-primary',      
    });
  }

  getlanguagesLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_LANGUAGES_LAZY_LOADING,
      variables,
    }).valueChanges;
  }

  
  requestHardcodedValuesData$(currentPage: number, skipRecords: number, takeRecords: number, order: any, catalog: string): Observable<any> {    
    const filter = JSON.parse(`{ "and":  [ { "languageId": { "eq": 1 } }, { "customerId": { "eq": 1 } }, { "tableName": { "eq": "${catalog}" } }, { "status": { "eq": "${RecordStatus.ACTIVE}" } } ] }`);
    // TODO Get language and customer from table
    const variableParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords, 
      filter, 
      order,
    }    
    const variables = this.setGraphqlGen(variableParameters);
    return this._apollo.watchQuery({ 
      query: GET_HARDCODED_VALUES, 
      variables, 
    }).valueChanges;  
  }


  //all this are repeated==============================
  
  setGraphqlGen(genParameters: GqlParameters): any {
    const { settingType, skipRecords, takeRecords, filter, order, id, status, processId, process} = genParameters;

    if (settingType === 'multiSelection') {
      return {
        processId,
        ...(skipRecords !== 0) && { recordsToSkip: skipRecords },
        ...(takeRecords !== 0) && { recordsToTake: takeRecords },                
        ...(filter) && { filterBy: filter },        
        ...(process) && { process },
        
      }
    } else if (settingType === 'tables') {
      return {
        ...(skipRecords !== 0) && { recordsToSkip: skipRecords },
        ...(takeRecords !== 0) && { recordsToTake: takeRecords },
        ...(order) && { orderBy: order },
        ...(filter) && { filterBy: filter },
      }
    } else if (settingType === 'status') {
      return { 
        id,
        status
      };      
    }
  }


  
// End ======================
}
