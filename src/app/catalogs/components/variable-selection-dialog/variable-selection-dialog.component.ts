import { Component, ElementRef, AfterViewInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Store } from '@ngrx/store';
import { EMPTY, Observable, Subscription, catchError, fromEvent, tap } from 'rxjs';
import { ButtonActions, GeneralCatalogParams, RecordStatus, SettingsData, SystemTables } from 'src/app/shared/models';
import { SharedService } from 'src/app/shared/services';
import { GeneralCatalogData, emptyGeneralCatalogData, emptyGeneralCatalogItem } from '../../models/catalogs-shared.models';
import { AppState, selectSettingsData } from 'src/app/state';
import { CatalogsService } from '../../services';
import { CustomValidators } from '../../custom-validators';
import { dissolve } from '../../../shared/animations/shared.animations';
import { GenericDialogComponent } from '../../../shared/components';

@Component({
  selector: 'app-variable-selection-dialog',
  templateUrl: './variable-selection-dialog.component.html',
  animations: [ dissolve, ],
  styleUrls: ['./variable-selection-dialog.component.scss']
})
export class VariableSelectionDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('variableSelectionDialog') variableSelectionDialog: ElementRef;

// Variables ================
  defaultButtonIcons: string[] = [
    'check',
    'cancel',
  ];
  loading: boolean = false;
  settingsData$: Observable<SettingsData>;
  settingsData: SettingsData;
  variables$: Observable<any>;
  variables: GeneralCatalogData = emptyGeneralCatalogData; 
  closed: boolean = false;
  defaultAction: string = 'cancel';
  classLegacy: string = 'spinner-card-font';  
  keypressSubscription: Subscription;
  selectionForm = new FormGroup({
    variable: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
  });
  selectionFormChangesSubscription: Subscription;
  takeRecords: number;
  order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);

  constructor (
    private _store: Store<AppState>,
    public _dialogRef: MatDialogRef<VariableSelectionDialogComponent>,
    public _sharedService: SharedService,
    private _catalogsService: CatalogsService,
    public _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { } 

// Hooks ====================
  ngOnInit() : void {    
    this.data.buttons.push({
      showIcon: true,
      icon: 'check',
      showCaption: true,
      caption: $localize`Seleccionar`,
      showTooltip: true,
      class: 'primary',
      tooltip: $localize`Selecciona la variable y cierra la ventana`,
      disabled: true,
      loading: false,
      action: ButtonActions.OK,
      default: true,       
      cancel: false,       
    });
    this.data.buttons.push({
      showIcon: true,
      icon: 'cancel',
      showCaption: true,
      caption: $localize`Cancelar`,
      showTooltip: true,        
      tooltip: $localize`Cierra esta ventana`,
      disabled: false,
      loading: false,
      action: ButtonActions.CANCEL,
      default: false,       
      cancel: true,       
    });       
    this.settingsData$ = this._store.select(selectSettingsData).pipe(
      tap(settingsData => {
        this.settingsData = settingsData;
        this.takeRecords = this.settingsData.catalog?.pageSize || 50        
        const currentPage = 0;
        this.requestVariablesData(currentPage);
      })
    );    
  
    this.selectionFormChangesSubscription = this.selectionForm.valueChanges
    .subscribe((formChanges: any) => {
      if (formChanges && formChanges.variable && formChanges.variable.id) {
        this.data.buttons.find((button : any) => button.action === ButtonActions.OK).disabled = false;
        this.data.variableId = formChanges.variable.id;
      } else {
        this.data.buttons.find((button : any) => button.action === ButtonActions.OK).disabled = true;
      }
    });  
  }

  ngOnDestroy(): void {
    if (this.keypressSubscription) this.keypressSubscription.unsubscribe();
    if (this.selectionFormChangesSubscription) this.selectionFormChangesSubscription.unsubscribe(); 
  }

  ngAfterViewInit(): void {
    this.keypressSubscription = fromEvent(this.variableSelectionDialog.nativeElement, 'keyup').subscribe((event: KeyboardEvent) => {
      if (event.key === 'Enter' && this.data.buttons.find((button : any) => button.default)) {
        const action = this.data.buttons.find((button : any) => button.default).action;
        this.handleClick(action);            
      } else if (event.key === 'Escape' && this.data.buttons.find((button : any) => button.cancel)) {
        const action = this.data.buttons.find((button : any) => button.cancel).action;
        this.handleClick(action);
      }
    });
  }
  
// Functions ================
  trackByFn(index: any) { 
    return index; 
  }

  handleClick(action: string) {
    if (action === 'cancel') {
      this.closed = true;
    }    
    this.data.buttons.find(b => b.action === action).loading = true;
    setTimeout(() => {      
      this.data.action = action;
      if (action === ButtonActions.OK) {
        if (this.data.currentVariables.find((v) => v.variableId === this.data.variableId)) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              defaultAction: 'cancel',
              title: $localize`VARIABLE YA AGREGADA`,  
              topIcon: 'warn_fill',
              buttons: [{
                action: 'ok',
                showIcon: true,
                icon: 'check',
                showCaption: true,
                caption: $localize`Agregar de todas maneras`,
                showTooltip: true,
                class: 'primary',
                tooltip: $localize`Duplica la variable al template de checklist`,
                default: true,
              }, {
                action: 'cancel',
                showIcon: true,
                icon: 'cancel',
                showCaption: true,
                caption: $localize`Cancelar`,
                showTooltip: true,            
                tooltip: $localize`Cancela la acción`,
                default: false,
              }],
              body: {
                message: $localize`Esta acción duplicará la variable seleccionada en la plantilla checklist con el Id <strong>${this.data.checklistTemplateId}</strong>.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: true,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            if (response.action === 'ok') {              
              this._dialogRef.close(this.data);      
            } else {
              this.data.buttons.find(b => b.action === action).loading = false;
            }  
          });
        } else {
          this._dialogRef.close(this.data);
        }              
      } else {
        this._dialogRef.close(this.data);
      }              
    }, 100);    
  }

  handleCloseButtonClick() {
    this.closed = true;
    this.data.action = 'cancel'; 
    this._dialogRef.close(this.data);
  }

  handleOptionSelected(getMoreDataParams: any){
    console.log('[handleOptionSelected]', getMoreDataParams)
  }

  getMoreData(getMoreDataParams: GeneralCatalogParams) {
    if (getMoreDataParams.catalogName === SystemTables.VARIABLES) {
      if (getMoreDataParams.initArray) {
        this.variables.currentPage = 0;
        this.variables.items = [];
      } else if (!this.variables.pageInfo.hasNextPage) {
        return;
      } else {
        this.variables.currentPage++;
      }
      this.requestVariablesData(        
        this.variables.currentPage,
        getMoreDataParams.textToSearch,  
      ); 
    }    
  }

  requestVariablesData(currentPage: number, filterStr: string = null) {    
    this.variables = {
      ...this.variables,
      currentPage,
      loading: true,
    }
    this.data.buttons.find((button : any) => button.action === ButtonActions.OK).loading = true;
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);   
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }      
    const skipRecords = this.variables.items.length;

    const variableParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order
    }    
    const variables = this._sharedService.setGraphqlGen(variableParameters);
    this.variables$ = this._catalogsService.geVariablesLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {
        const mappedItems = data?.data?.variablesPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        });
        this.variables = {
          ...this.variables,
          loading: false,
          pageInfo: data?.data?.variablesPaginated?.pageInfo,
          items: this.variables.items?.concat(mappedItems),
          totalCount: data?.data?.variablesPaginated?.totalCount,
        }
        this.data.buttons.find((button : any) => button.action === ButtonActions.OK).loading = false;
      }),
      catchError(() => EMPTY)
    )    
  }

  get SystemTables () {
    return SystemTables;
  }

// End ======================
}
