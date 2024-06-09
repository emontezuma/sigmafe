import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { EMPTY, Observable, Subscription, catchError, fromEvent, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../state/app.state'; 
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { AbstractControl, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { dissolve } from '../../../shared/animations/shared.animations';
import {  CatalogsService, CustomValidators, GeneralCatalogData, GeneralCatalogParams, GeneralHardcodedValuesData, MoldParameters, emptyGeneralCatalogData, emptyGeneralCatalogItem, emptyGeneralHardcodedValuesData } from 'src/app/catalogs';
import { ButtonActions, RecordStatus, SettingsData, SmallFont, SpinnerFonts, SpinnerLimits, SystemTables, toolbarMode } from 'src/app/shared/models';
import { SharedService } from 'src/app/shared/services';

@Component({
  selector: 'app-maintenance-history-dialog',
  templateUrl: './maintenance-history-dialog.component.html',
  animations: [ dissolve, ],
  styleUrls: ['./maintenance-history-dialog.component.scss']
})
export class MaintenanceHistoryDialogComponent implements AfterViewInit {
  @ViewChild('maintenanceHistory') maintenanceHistory: ElementRef;
  @ViewChild('f') private thisForm: NgForm;
  @ViewChild('moldMaintenanceHistory') private moldMaintenanceHistory: ElementRef;
  @ViewChild('firstField') firstField: ElementRef;
  
// Variables ================
  defaultButtonIcons: string[] = [
    'check',
    'cancel',
  ];
  loading: boolean = false;
  settingsData$: Observable<SettingsData>;
  everySecond$: Observable<boolean>;
  providers$: Observable<any>; 
  maintenanceStates$: Observable<any>;
  addMoldMaintenanceHistory$: Observable<any>;  
  maintenance$: Observable<any>;  

  settingsData: SettingsData;
  providers: GeneralCatalogData = emptyGeneralCatalogData;
  maintenanceStates: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  
  harcodedValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);

  closed: boolean = false;
  loaded: boolean = false;
  focusFirstField: boolean = false;
  savingData: boolean = false;
  timeOutforDefaultButton: number = 0;
  timeOutFortDialog: number = 0;
  defaultAction: string = 'cancel';
  classLegacy: string = 'spinner-card-font';
  limits: SpinnerLimits[] = [];
  fonts: SpinnerFonts[] = [{
    start: 0,
    finish: 100,
    size: 1.2,
    weight: 500,
  },{
    start: 100,
    finish: 999,
    size: 1,
    weight: 300,
  }];
  smallFont: SmallFont = {
    size: 0.8,
    weight: 300,
}

  maintenanceHistoryFormSubscription: Subscription;
  maintenanceHistoryForm = new FormGroup({
    provider: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator(), Validators.required ]),
    operatorName: new FormControl(''),
    notes: new FormControl('', Validators.required),    
    startDate: new FormControl(''),
    finishedDate: new FormControl(''),
    state: new FormControl('ok'),
    updateHitsCumulative: new FormControl(false),
    hitsAfter: new FormControl(0),
    updateLastMaintenanceDate: new FormControl(false),
    maintenanceDate: new FormControl(new Date()),
  });
  takeRecords: number = 50;
  keypressSubscription: Subscription;

  constructor (
    private _store: Store<AppState>,
    public _dialogRef: MatDialogRef<MaintenanceHistoryDialogComponent>,
    public _sharedService: SharedService,
    public _dialog: MatDialog,
    private _catalogsService: CatalogsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

// Hooks ====================
  ngOnInit() : void {
    this.settingsData$ = this._store.select(selectSettingsData).pipe(
      tap( settingsData => {
        this.settingsData = settingsData;
        this.takeRecords = this.settingsData.catalog?.pageSize || 50        
        const currentPage = 0;
        this.requestProvidersData(currentPage);
        this.requestMaintenanceStatesData(currentPage);
        if (this.data.id) {
          this.requestMaintenance()
        } else {
          this.loaded = true;
        }
        if (this.data.duration >= 0) {
          this.timeOutFortDialog = this.data.duration;
        } else {
          this.timeOutFortDialog = this.settingsData.timeOutFortDialog;;
        }
        if (this.timeOutFortDialog !== 0) this.timeOutFortDialog++;
        if (this.timeOutFortDialog && this.timeOutFortDialog > 0) {
          this.timeOutforDefaultButton = this.timeOutFortDialog;
          this.everySecond$ = this._sharedService.pastSecond.pipe(
            tap((pulse) => {
              this.timeOutforDefaultButton = this.timeOutforDefaultButton - 1;
              if (this.timeOutforDefaultButton === 0) {
                this.data.action = this.defaultAction;      
                this._dialogRef.close(this.data);
              }    
            })
          );
        }
      })
    ); 
    this.maintenanceHistoryForm.get('hitsAfter').disable();       
    this.maintenanceHistoryForm.get('maintenanceDate').disable();
  }

  ngAfterViewInit(): void {
    this.keypressSubscription = fromEvent(this.maintenanceHistory.nativeElement, 'keyup').subscribe((event: KeyboardEvent) => {
      if (event.key === 'Enter' && this.data.buttons.find((button : any) => button.default) && !this.data.buttons.find((button : any) => button.default).disabled) {
        this.handleClick(this.data.buttons.find((button : any) => button.default).action);
      } else if (event.key === 'Escape') {
        if (!this.data.buttons.find((button : any) => button.action === ButtonActions.CANCEL).disabled) {
          this.handleClick(ButtonActions.CANCEL);
        } else {
          this.handleClick(ButtonActions.CLOSE);
        }
      };
    });
    this.maintenanceHistoryFormSubscription = this.maintenanceHistoryForm.valueChanges.subscribe((moldFormChanges: any) => {            
      if (this.loaded) {
        this.setButtonState(toolbarMode.EDITING_WITH_NO_DATA);
        this.data.buttons.find(b => b.action === ButtonActions.SAVE).disabled = !this.enabledSaveButton();
      }      
    });    
  }

  ngOnDestroy(): void {
    if (this.maintenanceHistoryFormSubscription) this.maintenanceHistoryFormSubscription.unsubscribe();      
    if (this.keypressSubscription) this.keypressSubscription.unsubscribe();
  }
  
// Functions ================
  trackByFn(index: any, item: any) { 
    return index; 
  }

  handleClick(action: string) {
    this.data.buttons.find(b => b.action === action).loading = true;
    if (action === ButtonActions.SAVE) {
      this.thisForm.ngSubmit.emit();      
    } else if (action === ButtonActions.CANCEL) {
      if (this.data.id) {
        this.requestMaintenance();
      } else {
        this.initForm();
      }      
    } else if (action === ButtonActions.CLOSE) {      
      this.handleCloseButtonClick();    
    }    
  }

  handleCloseButtonClick() {
    this.closed = true;
    this.data.action = 'close'; 
    this._dialogRef.close(this.data);
  }

  onSubmit() { 
    this.addOrUpdateMaintenanceHistory();
  }

  setButtonState(state: toolbarMode) {
    if (state === toolbarMode.INITIAL_WITH_NO_DATA && !this.data.buttons.find((button : any) => button.action === ButtonActions.CANCEL).disabled) {      
      this.data.buttons.find((button : any) => button.action === ButtonActions.CANCEL).disabled = true;    
      this.data.buttons.find((button : any) => button.action === ButtonActions.SAVE).disabled = true;    
    } else if (state === toolbarMode.EDITING_WITH_NO_DATA && this.data.buttons.find((button : any) => button.action === ButtonActions.CANCEL).disabled) {      
      this.data.buttons.find((button : any) => button.action === ButtonActions.CANCEL).disabled = false;    
    }
  }

  requestProvidersData(currentPage: number, filterStr: string = null) {    
    this.providers = {
      ...this.providers,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);      
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }      
    const order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);
    const skipRecords = this.providers.items.length;

    const moldParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order,
    }    
    const variables = this.setGraphqlVariables(moldParameters);
    this.providers$ = this._catalogsService.getProvidersLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {
        const mappedItems = data?.data?.providersPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        });
        this.providers = {
          ...this.providers,
          loading: false,
          pageInfo: data?.data?.providersPaginated?.pageInfo,
          items: this.providers.items?.concat(mappedItems),
          totalCount: data?.data?.providersPaginated?.totalCount,
        }        
      }),
      catchError(() => EMPTY)
    )    
  }

  requestMaintenanceStatesData(currentPage: number) {
    this.maintenanceStates = {
      ...this.maintenanceStates,
      currentPage,
      loading: true,
    }        
    this.maintenanceStates$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrder, SystemTables.MOLD_MAINTENANCE_STATES)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.maintenanceStates.items?.concat(data?.data?.hardcodedValues?.items);        
        this.maintenanceStates = {
          ...this.maintenanceStates,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }

  setGraphqlVariables(moldParameters: MoldParameters): any {
    const { settingType, skipRecords, takeRecords, filter, order, id, customerId, status} = moldParameters;

    if (settingType === 'tables') {
      return {  
        ...(skipRecords !== 0) && { recordsToSkip: skipRecords },
        ...(takeRecords !== 0) && { recordsToTake: takeRecords },
        ...(order) && { orderBy: order },
        ...(filter) && { filterBy: filter },
      }
    } else if (settingType === 'status') {
      return { 
        id,
        customerId,
        status
      };      
    }
  }

  getMoreData(getMoreDataParams: GeneralCatalogParams) {
    if (getMoreDataParams.catalogName === SystemTables.PROVIDERS) {
      if (getMoreDataParams.initArray) {
        this.providers.currentPage = 0;   
        this.providers.items = [];
      } else if (!this.providers.pageInfo.hasNextPage) {
        return;
      } else {
        this.providers.currentPage++;
      }
      this.requestProvidersData(        
        this.providers.currentPage,
        getMoreDataParams.textToSearch,  
      );    
    }
  }

  handleOptionSelected(getMoreDataParams: any){
    console.log('[handleOptionSelected]', getMoreDataParams)
  }

  enableHits(enabling: boolean) {
    if (enabling) {
      this.maintenanceHistoryForm.get('hitsAfter').enable();
    } else {
      this.maintenanceHistoryForm.get('hitsAfter').disable();
    }
  }

  enableMaintenanceDate(enabling: boolean) {
    if (enabling) {
      this.maintenanceHistoryForm.get('maintenanceDate').enable();
    } else {
      this.maintenanceHistoryForm.get('maintenanceDate').disable();
    }
  }

  enabledSaveButton(): boolean {
    let maintenanceDate = null;    
    const fc = this.maintenanceHistoryForm.controls;
    if (fc.maintenanceDate.invalid) {
      maintenanceDate = null;
    } else if (fc.maintenanceDate.value) {
      if (!this._sharedService.isDateValid(this._sharedService.formatDate(fc.maintenanceDate.value))) {
        fc.maintenanceDate.setErrors({ invalidDate: true });
      } else {
        maintenanceDate = this._sharedService.formatDate(fc.maintenanceDate.value, 'yyyy-MM-dd');
      }
    } else {
      maintenanceDate = null;
    }
    this.maintenanceHistoryForm.markAllAsTouched();
    if (!fc.provider.value || !fc.provider.value.id) {
      fc.provider.setErrors({ invalid: true });
    }
    if (!fc.notes.value) {
      fc.notes.setErrors({ invalid: true });
    }
    if (fc.updateHitsCumulative.value && (fc.hitsAfter.value === undefined || fc.hitsAfter.value === null || fc.hitsAfter.value.toString() === '') || fc.hitsAfter.value < 0) {
      fc.hitsAfter.setErrors({ invalid: true });
    }
    if (fc.updateLastMaintenanceDate.value && maintenanceDate === null && this.data.id === 0) {
      fc.maintenanceDate.setErrors({ invalid: true });
    }
    this.data.bottomMessage = this.maintenanceHistoryForm.valid ? '' : $localize`Existen errores o campos incompletos en el formulario`;
    return this.maintenanceHistoryForm.valid
  }

  initForm() {
    this.thisForm.resetForm();      
    this.maintenanceHistoryForm.reset({
      state: 'ok',
      hitsAfter: 0,
      maintenanceDate: new Date()
    });
    this.maintenanceHistoryForm.get('hitsAfter').disable();       
    this.maintenanceHistoryForm.get('maintenanceDate').disable();
    this.maintenanceHistoryForm.controls.provider.setErrors(null);
    this.maintenanceHistoryForm.controls.notes.setErrors(null);
    this.setButtonState(toolbarMode.INITIAL_WITH_NO_DATA);
    this.data.bottomMessage = '';
    this.focusFirstField = true;
    setTimeout(() => {
      this.moldMaintenanceHistory.nativeElement.scrollIntoView({            
        behavior: 'smooth',
        block: 'start',
      });      
      this.data.buttons.find(b => b.action === ButtonActions.CANCEL).loading = false;
      this.data.buttons.find(b => b.action === ButtonActions.SAVE).loading = false;      
      this.focusFirstField = false;
    }, 200);
  }

  addOrUpdateMaintenanceHistory() {
    this.savingData = true;
    const fc = this.maintenanceHistoryForm.controls;
    const variables = {
      id: this.data.id,
      customerId: 1, // TODO: Get from profile
      moldId: this.data.moldId,
      providerId: fc.provider.value.id,
      state: fc.state.value,
      operatorName: fc.operatorName.value,
      notes: fc.notes.value,      
      startDate: fc.startDate.value ? this._sharedService.formatDate(fc.startDate.value, 'yyyy-MM-dd') : null,
      finishedDate: fc.finishedDate.value ? this._sharedService.formatDate(fc.finishedDate.value, 'yyyy-MM-dd') : null,

      ...(this.data.id === 0) && { updateLastMaintenanceDate: fc.updateLastMaintenanceDate.value ? 'y' : '',
      maintenanceDate: fc.updateLastMaintenanceDate.value ? this._sharedService.formatDate(fc.maintenanceDate.value, 'yyyy-MM-dd') : null,
      updateHitsCumulative: fc.updateHitsCumulative.value ? 'y' : '',
      hitsAfter: fc.updateHitsCumulative.value ? +fc.hitsAfter.value : null, },

    }
    this.addMoldMaintenanceHistory$ = this._catalogsService.addMoldMaintenanceHistory$(variables)
    .pipe(
      tap(() => {
        if (this.data.id === 0) {
          this.initForm();
          this.savingData = false;
          this.data.buttons.find(b => b.action === ButtonActions.SAVE).loading = true;
          const message = $localize`Se registra el histórico de mantenimiento satisfactoriamente`;
          this._sharedService.showSnackMessage({
            message,
            snackClass: 'snack-primary',
          });
        } else {
          const message = $localize`Se actualiza el registro de mantenimiento`;
          this._sharedService.showSnackMessage({
            message,
            snackClass: 'snack-primary',
          });
          this.handleCloseButtonClick();    
        }
        this.data.maintenanceUpdated = true;
      })
    )
  }

  requestMaintenance() {
    this.savingData = true;
    this.loaded = false;
    const customerId = 1; // TODO: Get from profile
    const filterBy = JSON.parse(`{ "and": [ { "data": { "customerId": { "eq": ${customerId} } } }, { "data": { "id": { "eq": ${this.data.id} } } } ] }`);
    this.maintenance$ = this._catalogsService.getMaintenancesLazyLoadingDataGql$({ filterBy })
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.maintenanceHistoricalsPaginated?.items.map((h) => {
          return {
            ...h.data,
            provider: {
              ...h.data.provider,
              translatedName: h.data.provider.translations.length > 0 ? h.data.provider.translations[0].name : h.data.provider.name,
              isTranslated: h.data.provider.translations.length > 0 && h.data.provider.translations[0].languageId > 0 ? true : false,
            },
            isTranslated: h.isTranslated,
            friendlyState: h.friendlyState,
          }
        });
        if (mappedItems.length > 0) {
          this.maintenanceHistoryForm.controls.state.setValue(mappedItems[0].state);
          this.maintenanceHistoryForm.controls.notes.setValue(mappedItems[0].notes);
          this.maintenanceHistoryForm.controls.provider.setValue(mappedItems[0].provider);
          this.maintenanceHistoryForm.controls.operatorName.setValue(mappedItems[0].operatorName);
          this.maintenanceHistoryForm.controls.startDate.setValue(mappedItems[0].startDate ? mappedItems[0].startDate : null);
          this.maintenanceHistoryForm.controls.finishedDate.setValue(mappedItems[0].finishedDate ? mappedItems[0].finishedDate : null);
          this.maintenanceHistoryForm.controls.updateHitsCumulative.setValue(mappedItems[0].updateHitsCumulative === 'y');
          this.maintenanceHistoryForm.controls.updateLastMaintenanceDate.setValue(mappedItems[0].updateLastMaintenanceDate === 'y');
          this.maintenanceHistoryForm.controls.hitsAfter.setValue(mappedItems[0].hitsAfter);
          this.maintenanceHistoryForm.controls.maintenanceDate.setValue(mappedItems[0].dateBefore);

          this.maintenanceHistoryForm.controls.updateHitsCumulative.disable();
          this.maintenanceHistoryForm.controls.updateLastMaintenanceDate.disable();
          this.maintenanceHistoryForm.controls.hitsAfter.disable();
          this.maintenanceHistoryForm.controls.maintenanceDate.disable();
          this.maintenanceHistoryForm.controls.provider.setErrors(null);
          this.maintenanceHistoryForm.controls.notes.setErrors(null);
          this.loaded = true;
          this.focusFirstField = true;
          setTimeout(() => {
            this.focusFirstField = false;
            this.savingData = false;
            this.moldMaintenanceHistory.nativeElement.scrollIntoView({            
              behavior: 'smooth',
              block: 'start',
            });      
          }, 200);
          this.data.buttons.find(b => b.action === ButtonActions.CANCEL).loading = false;
          this.data.buttons.find(b => b.action === ButtonActions.SAVE).loading = false;    
          this.data.bottomMessage = '';  
          this.setButtonState(toolbarMode.INITIAL_WITH_NO_DATA);
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  get SystemTables () {
    return SystemTables;
  }

// End ======================
}
