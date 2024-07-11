import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralCatalogData, emptyGeneralCatalogData, emptyGeneralCatalogItem, emptyGeneralHardcodedValuesItem } from '../../models/catalogs-shared.models';
import { CustomValidators } from '../../custom-validators';
import { ChecklistTemplateLine, VariablePossibleValue } from '../../models';
import { EMPTY, Observable, Subscription, catchError, filter, tap } from 'rxjs';
import { Attachment, ButtonActions, GeneralCatalogParams, GeneralHardcodedValuesData, GeneralValues, HarcodedVariableValueType, RecordStatus, ScreenDefaultValues, SettingsData, SystemTables, dialogByDefaultButton, emptyGeneralHardcodedValuesData, originProcess } from 'src/app/shared/models';
import { dissolve } from '../../../shared/animations/shared.animations';  
import { AppState, selectSettingsData } from 'src/app/state';
import { Store } from '@ngrx/store';
import { SharedService } from 'src/app/shared/services';
import { CatalogsService } from '../../services';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { GenericDialogComponent } from 'src/app/shared/components';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-checklist-template-edition-line',
  templateUrl: './checklist-template-edition-line.component.html',
  animations: [ dissolve, ],
  styleUrls: ['./checklist-template-edition-line.component.scss']
})
export class ChecklistTemplateEditionLineComponent implements OnChanges, OnDestroy {
  @ViewChild('possibleValue', { static: false }) possibleValue: ElementRef;  
  @Input() line: ChecklistTemplateLine;
  @Input() updatingCount: number;

  @Output() formChange = new EventEmitter<{ lineNumber: number, formData: any }>();
  checkListTemplateLineChanged$: Observable<any>;

  variableForm = new FormGroup({
    name: new FormControl(
      '', 
      Validators.required,      
    ),
    recipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),    
    required: new FormControl(emptyGeneralHardcodedValuesItem),
    allowComments: new FormControl(emptyGeneralHardcodedValuesItem),
    allowNoCapture: new FormControl(emptyGeneralHardcodedValuesItem),
    allowAlarm: new FormControl(emptyGeneralHardcodedValuesItem),
    showChart: new FormControl(emptyGeneralHardcodedValuesItem),
    showParameters: new FormControl(emptyGeneralHardcodedValuesItem),
    showLastValue: new FormControl(emptyGeneralHardcodedValuesItem),
    notifyAlarm: new FormControl(emptyGeneralHardcodedValuesItem),
    valueType: new FormControl(emptyGeneralHardcodedValuesItem),
    useVariableAttachments: new FormControl(true),
    notes: new FormControl(''),
    uomName: new FormControl(''),
    showNotes: new FormControl(false),
    minimum:  new FormControl(''),
    maximum:  new FormControl(''),
    byDefault:  new FormControl(''),    
    byDefaultDate:  new FormControl(new Date()),    
    byDefaultTime:  new FormControl(''),    
    possibleValue: new FormControl(''),
    possibleValues: new FormControl(''),
    possibleValuePosition: new FormControl('l'),
    byDefaultDateType: new FormControl(emptyGeneralHardcodedValuesItem),    
  });

  recipients$: Observable<any>;
  recipients: GeneralCatalogData = emptyGeneralCatalogData;
  settingsData$: Observable<SettingsData>; 
  genYesNoValues$: Observable<any>;
  settingsData: SettingsData;
  valuesByDefault: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData;
  duplicateAttachmentsList$: Observable<any>;   
  
  downloadFiles: Subscription;  
  uploadFiles: Subscription;
  formStatus$: Observable<any>;  

  genYesNoValues: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  variableByDefaultDate: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; ;
  variableByDefaultDate$: Observable<any>; 

  takeRecords: number;
  order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);
  harcodedValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);
  harcodedValuesOrderById: any = JSON.parse(`{ "id": "${'ASC'}" }`);
  variableFormChangesSubscription: Subscription;
  byDefaultValueType: string = '';

  attachmentsTableColumns: string[] = [ 'index', 'icon', 'name', 'actions-attachments' ];
  attachmentsTable = new MatTableDataSource<Attachment>([]);
  
  possibleValuesTableColumns: string[] = [ 'item', 'value', 'byDefault', 'alarmedValue', 'actions' ];
  possibleValuesTable = new MatTableDataSource<VariablePossibleValue>([]);
  possibleValuePositions = [
    { id: 'l', description: $localize`Al final de la lista` },  
    { id: 'f', description: $localize`Al prncipio de la lista` }, 
  ];

  editingValue: number = -1;
  addAttachmentButtonClick: boolean = false;
  variableAttachmentLabel: string = '';
  
  constructor(
    private _store: Store<AppState>,
    public _sharedService: SharedService,
    private _catalogsService: CatalogsService,
    public _dialog: MatDialog,  
    private _http: HttpClient,
  ) {}
  
// Hooks ====================
  ngOnInit() {
    // this.variableForm.get('name').disable();
    
    this.settingsData$ = this._store.select(selectSettingsData).pipe(
      tap(settingsData => {
        this.settingsData = settingsData;
        this.takeRecords = this.settingsData.catalog?.pageSize || 50        
        const currentPage = 0;
        this.requestRecipientsData(currentPage);
        this.requestGenYesNoValuesData(currentPage);
        this.requestVariableByDefaultDateValuesData(currentPage);      
        this.requestVariableByDefaultDateValuesData(currentPage);          
        this.updateFormFromData();
      })
    );
        
    this.variableFormChangesSubscription = this.variableForm.valueChanges
    .subscribe(() => {      
      this.formChange.emit({ lineNumber: this.line.line, formData: this.variableForm.controls });      
    });

    this.variableFormChangesSubscription = this.variableForm.controls.minimum.valueChanges
    .subscribe((value: any) => {
      if (value && this.variableForm.controls.maximum.value && (+value > +this.variableForm.controls.maximum.value)) {
        this.variableForm.controls.minimum.setErrors({ invalidValue: true });
      } else {
        this.variableForm.controls.minimum.setErrors(null);
      }      
    });

    this.variableFormChangesSubscription = this.variableForm.controls.maximum.valueChanges
    .subscribe((value: any) => {
      if (value && this.variableForm.controls.minimum.value && (+value < +this.variableForm.controls.minimum.value)) {
        this.variableForm.controls.minimum.setErrors({ invalidValue: true });
      } else {
        this.variableForm.controls.minimum.setErrors(null);
      }      
    });

    this.checkListTemplateLineChanged$ = this._catalogsService.checkListTemplateLineChanged.pipe(
      tap((lineData) => {     
        if (lineData?.data?.validate) {
          this.validateTables();
        } else if (lineData?.data) {
          this.line = lineData.data;
          this.updateFormFromData();
          const message = $localize`La variable ha se ha actualizado`;
          this._sharedService.showSnackMessage({
            message,
            snackClass: 'snack-primary',
            progressBarColor: 'primary',
            icon: 'check',
          });
        }
      })
    );

    this.formStatus$ = this.variableForm.statusChanges.pipe(
      tap(formStatus => {
        this.line.error = formStatus === 'INVALID';
      })
    );
  }
    
  ngOnChanges() : void {
    this.setAttachmentLabel();
    this.updateFormFromData();
  }  

  ngOnDestroy() : void {
    if (this.formChange) this.formChange.unsubscribe();
    if (this.variableFormChangesSubscription) this.variableFormChangesSubscription.
    unsubscribe(); 
    if (this.downloadFiles) this.downloadFiles.unsubscribe();
    if (this.uploadFiles) this.uploadFiles.unsubscribe();
  }

// Functions ================
  requestRecipientsData(currentPage: number, filterStr: string = null) {    
    this.recipients = {
      ...this.recipients,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }
    const skipRecords = this.recipients.items.length;

    const variableParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order
    }    
    const variables = this._sharedService.setGraphqlGen(variableParameters); 
    this.recipients$ = this._catalogsService.getRecipientsLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.recipientsPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        })
        this.recipients = {
          ...this.recipients,
          loading: false,
          pageInfo: data?.data?.recipientsPaginated?.pageInfo,
          items: this.recipients.items?.concat(mappedItems),
          totalCount: data?.data?.recipientsPaginated?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  getMoreData(getMoreDataParams: GeneralCatalogParams) {
    if (getMoreDataParams.catalogName === SystemTables.RECIPIENTS) {
      if (getMoreDataParams.initArray) {
        this.recipients.currentPage = 0;
        this.recipients.items = [];
      } else if (!this.recipients.pageInfo.hasNextPage) {
        return;
      } else {
        this.recipients.currentPage++;
      }
      this.requestRecipientsData(        
        this.recipients.currentPage,
        getMoreDataParams.textToSearch,  
      ); 
    }    
  }

  requestGenYesNoValuesData(currentPage: number) {
    this.genYesNoValues = {
      ...this.genYesNoValues,
      currentPage,
      loading: true,
    }        
    this.genYesNoValues$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrder, SystemTables.GEN_VALUES_YES_NO)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.genYesNoValues.items?.concat(data?.data?.hardcodedValues?.items);
        this.genYesNoValues = {
          ...this.genYesNoValues,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }

  requestVariableByDefaultDateValuesData(currentPage: number) {
    this.variableByDefaultDate = {
      ...this.variableByDefaultDate,
      currentPage,
      loading: true,
    }        
    this.variableByDefaultDate$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrderById, SystemTables.VARIABLE_BY_DEFAULT_DATE)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.variableByDefaultDate.items?.concat(data?.data?.hardcodedValues?.items);
        this.variableByDefaultDate = {
          ...this.genYesNoValues,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }

  updateFormFromData(): void {    
    this.variableForm.patchValue({
      name: this.line.name,
      notes: this.line.notes,      
      uomName: this.line.uomName,      
      recipient: this.line.recipient,      
      required: this.line.required,
      allowAlarm: this.line.allowAlarm,
      allowNoCapture: this.line.allowComments,
      allowComments: this.line.allowComments,
      showChart: this.line.showChart,            
      useVariableAttachments: this.line.useVariableAttachments === GeneralValues.YES,
      showLastValue: this.line.showLastValue,            
      showParameters: this.line.showParameters,            
      notifyAlarm: this.line.notifyAlarm,
      valueType: this.line.valueType,      
      byDefault: this.line.byDefault,    
      showNotes: this.line.showNotes === GeneralValues.YES,   
      minimum: this.line.minimum,
      maximum: this.line.maximum,            
      byDefaultDateType: this.line.byDefaultDateType,    
      
    });
    if (this.variableForm.controls.valueType.value ===  HarcodedVariableValueType.DATE_AND_TIME && this.variableForm.controls.byDefaultDateType.value === GeneralValues.SPECIFIC && this.variableForm.controls.byDefault.value) {
      const dateAndTime = this.variableForm.controls.byDefault.value.split(' ');
      this.variableForm.patchValue({        
        byDefaultDate: dateAndTime.length > 0 ? new Date(dateAndTime[0]) : null,
        byDefaultTime: dateAndTime.length > 1 ? dateAndTime[1] : null,
      });
    }
    this.attachmentsTable = new MatTableDataSource<Attachment>(this.line.attachments);
    this.prepareListOfValues();    
        
  } 

  handleMoveToFirst(id: number) {
    const valueIndex = this.line.valuesList.findIndex((v: VariablePossibleValue) => v.order === id);
    const tmpValue = JSON.parse(JSON.stringify(this.line.valuesList[valueIndex]));
    this.line.valuesList.splice(valueIndex, 1);
    this.line.valuesList.unshift({
      order: 0,
      value: tmpValue.value,
      byDefault: tmpValue.byDefault,
      alarmedValue: tmpValue.alarmedValue,
    })
    let index = 1;
    this.line.valuesList.forEach((v: VariablePossibleValue) => {
      v.order = index++;
    });
    this.possibleValuesTable = new MatTableDataSource<VariablePossibleValue>(this.line.valuesList);    
    this.setEditionButtonsState();
  }

  handleMoveToUp(id: number) {
    const valueIndex = this.line.valuesList.findIndex((v: VariablePossibleValue) => v.order === id);
    const tmpValue = JSON.parse(JSON.stringify(this.line.valuesList[valueIndex]));
    const editingItem = this.line.valuesList[valueIndex - 1];

    if (editingItem) {      
      this.line.valuesList[valueIndex].value = editingItem.value;
      this.line.valuesList[valueIndex].byDefault = editingItem.byDefault;
      this.line.valuesList[valueIndex].alarmedValue = editingItem.alarmedValue;

      editingItem.value = tmpValue.value;
      editingItem.byDefault = tmpValue.byDefault;
      editingItem.alarmedValue = tmpValue.alarmedValue;
      
      this.possibleValuesTable = new MatTableDataSource<VariablePossibleValue>(this.line.valuesList);    
      this.setEditionButtonsState();      
    }
  }

  handleMoveToDown(id: number) {
    const valueIndex = this.line.valuesList.findIndex((v: VariablePossibleValue) => v.order === id);
    const tmpValue = JSON.parse(JSON.stringify(this.line.valuesList[valueIndex]));
    const editingItem = this.line.valuesList[valueIndex + 1];
    
    if (editingItem) {      
      this.line.valuesList[valueIndex].value = editingItem.value;
      this.line.valuesList[valueIndex].byDefault = editingItem.byDefault;
      this.line.valuesList[valueIndex].alarmedValue = editingItem.alarmedValue;      

      editingItem.value = tmpValue.value;
      editingItem.byDefault = tmpValue.byDefault;
      editingItem.alarmedValue = tmpValue.alarmedValue;      
      
      this.possibleValuesTable = new MatTableDataSource<VariablePossibleValue>(this.line.valuesList);    
      this.setEditionButtonsState();      
    }
  }

  handleEdit(id: number) {
    this.editingValue = id;
    this.variableForm.controls.possibleValue.setValue(this.line.valuesList.find((v: VariablePossibleValue) => v.order === id).value);
    this.possibleValuePositions.push(
      { id: 's', description: $localize`Orden original` },       
    )
    if (this.variableForm.controls.possibleValuePosition.enabled) this.variableForm.controls.possibleValuePosition.disable({ emitEvent: false });
    this.variableForm.controls.possibleValuePosition.setValue('s');
  }

  handleRemove(id: number) {
    const valueIndex = this.line.valuesList.findIndex((v: VariablePossibleValue) => v.order === id);
    this.line.valuesList.splice(valueIndex, 1);
    let index = 1;
    this.line.valuesList.forEach((v: VariablePossibleValue) => {
      v.order = index++;
    });
    this.possibleValuesTable = new MatTableDataSource<VariablePossibleValue>(this.line.valuesList);
    if (this.variableForm.controls.possibleValuePosition.disabled) this.variableForm.controls.possibleValuePosition.enable({ emitEvent: false });
    this.setEditionButtonsState();
  }

  handleAlarmed(id: number) {
    const value = this.line.valuesList.find((v: VariablePossibleValue) => v.order === id);
    value.alarmedValue = !value.alarmedValue;
    this.setEditionButtonsState();
  }

  handleByDefault(id: number) {
    if (this.line.valuesList.length === 1 && this.line.valuesList[0].byDefault) {
      this.line.valuesList[0].byDefault = false;
    } else {
      this.line.valuesList.forEach((v: VariablePossibleValue) => {
        v.byDefault = v.order === id;
      });    
    }
    
    this.setEditionButtonsState();
  }

  handleEditPossibleValue() {
    if (this.editingValue > -1) {
      const editingItem = this.line.valuesList.find((v: VariablePossibleValue) => v.order === this.editingValue);
      if (editingItem) {
        editingItem.value = this.variableForm.controls.possibleValue.value;
        this.possibleValuePositions.pop();
      }        
    } else {
      if (this.variableForm.controls.possibleValuePosition.value === 'l') {
        this.line.valuesList.push({
          order: this.line.valuesList.length + 1,
          value: this.variableForm.controls.possibleValue.value,
          byDefault: false,
          alarmedValue: false,
        })
      } else {
        this.addPossibleValueAtFirst();
      }
      this.possibleValuesTable = new MatTableDataSource<VariablePossibleValue>(this.line.valuesList);      
    }
    this.editingValue = -1;   
    this.variableForm.controls.possibleValue.setValue('');
    this.variableForm.controls.possibleValuePosition.setValue('l');      
    setTimeout(() => {
      if (this.variableForm.controls.possibleValuePosition.disabled) this.variableForm.controls.possibleValuePosition.enable();
      this.possibleValue.nativeElement.focus();      
    }, 100)
  }

  addPossibleValueAtFirst() {
    this.line.valuesList.unshift({
      order: 0,
      value: this.variableForm.controls.possibleValue.value,
      byDefault: false,
      alarmedValue: false,
    })
    let index = 1;
    this.line.valuesList.forEach((v: VariablePossibleValue) => {
      v.order = index++;
    })
  }

  handleKeyDown(event: KeyboardEvent) {     
    if (event.key === 'Enter' && this.variableForm.controls.possibleValue.value) {
      event.preventDefault();
      event.stopPropagation();
      this.handleEditPossibleValue();      
    }    
  }

  handleCancelPossibleValue() {
    this.variableForm.controls.possibleValue.setValue('');
    this.variableForm.controls.possibleValuePosition.setValue('l');
    if (this.variableForm.controls.possibleValuePosition.disabled) this.variableForm.controls.possibleValuePosition.enable();
    this.editingValue = -1;
    setTimeout(() => {
      this.possibleValue.nativeElement.focus();    
    }, 100)
  }

  prepareListOfValues() {
    if (this.line.possibleValues) {
      try {
        this.line.valuesList = JSON.parse(this.line.possibleValues);
      } catch (error) {
        this.line.valuesList = null;
      }          
    } else {
      this.line.valuesList = null;
    }
    this.possibleValuesTable = new MatTableDataSource<VariablePossibleValue>(this.line.valuesList);        
  }

  handleAttachmentMoveToFirst(id: number) {
    const valueIndex = this.line.attachments.findIndex((v: Attachment) => v.index === id);
    const tmpValue = JSON.parse(JSON.stringify(this.line.attachments[valueIndex]));
    this.line.attachments.splice(valueIndex, 1);
    this.line.attachments.unshift({
      index: 0,
      name: tmpValue.name,
      image: tmpValue.image,
      id: tmpValue.id,
      icon: tmpValue.icon,      
    })
    let index = 0;
    this.line.attachments.forEach((v: Attachment) => {
      v.index = index++;
    });
    this.attachmentsTable = new MatTableDataSource<Attachment>(this.line.attachments);    
    this.setEditionButtonsState();
  }

  handleAttachmentMoveToLast(id: number) {
    const valueIndex = this.line.attachments.findIndex((v: Attachment) => v.index === id);
    const tmpValue = JSON.parse(JSON.stringify(this.line.attachments[valueIndex]));
    this.line.attachments.splice(valueIndex, 1);
    this.line.attachments.push({
      index: 0,
      name: tmpValue.name,
      image: tmpValue.image,
      id: tmpValue.id,
      icon: tmpValue.icon,      
    })
    let index = 0;
    this.line.attachments.forEach((v: Attachment) => {
      v.index = index++;
    });
    this.attachmentsTable = new MatTableDataSource<Attachment>(this.line.attachments);    
    this.setEditionButtonsState();
  }

  handleAttachmentMoveToUp(id: number) {
    const valueIndex = this.line.attachments.findIndex((v: Attachment) => v.index === id);
    const tmpValue = JSON.parse(JSON.stringify(this.line.attachments[valueIndex]));
    const editingItem = this.line.attachments[valueIndex - 1];

    if (editingItem) {      
      this.line.attachments[valueIndex].name = editingItem.name;
      this.line.attachments[valueIndex].id = editingItem.id;
      this.line.attachments[valueIndex].icon = editingItem.icon;
      this.line.attachments[valueIndex].image = editingItem.image;

      editingItem.name = tmpValue.name;
      editingItem.id = tmpValue.id;
      editingItem.icon = tmpValue.icon;
      editingItem.image = tmpValue.image;
      
      this.attachmentsTable = new MatTableDataSource<Attachment>(this.line.attachments);    
      this.setEditionButtonsState();      
    }
  }

  handleAttachmentMoveToDown(id: number) {
    const valueIndex = this.line.attachments.findIndex((v: Attachment) => v.index === id);
    const tmpValue = JSON.parse(JSON.stringify(this.line.attachments[valueIndex]));
    const editingItem = this.line.attachments[valueIndex + 1];
    
    if (editingItem) {      
      this.line.attachments[valueIndex].name = editingItem.name;
      this.line.attachments[valueIndex].image = editingItem.image;
      this.line.attachments[valueIndex].id = editingItem.id;
      this.line.attachments[valueIndex].icon = editingItem.icon;      

      editingItem.name = tmpValue.name;
      editingItem.id = tmpValue.id;
      editingItem.icon = tmpValue.icon;      
      editingItem.image = tmpValue.image;      
      
      this.attachmentsTable = new MatTableDataSource<Attachment>(this.line.attachments);    
      this.setEditionButtonsState();      
    }
  }

  handleAttachmentRemove(id: number) {
    const valueIndex = this.line.attachments.findIndex((v: Attachment) => v.index === id);
    this.line.attachments.splice(valueIndex, 1);
    let index = 0;
    this.line.attachments.forEach((v: Attachment) => {
      v.index = index++;
    });
    this.attachmentsTable = new MatTableDataSource<Attachment>(this.line.attachments);
    this.setAttachmentLabel();
    this.setEditionButtonsState();
  }

  messageMaxAttachment() {
    this.addAttachmentButtonClick = true;    
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`Máximo de adjuntos alcanzado`,  
        topIcon: 'warn-fill',
        defaultButtons: dialogByDefaultButton.ACCEPT,
        buttons: [],
        body: {
          message: $localize`Se ha alcanzado el límite de adjuntos para variables ${this.settingsData?.attachments?.variables ?? 10}.`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {
      this.addAttachmentButtonClick = false;
    });    
  }

  onAttachmentFileSelected(event: any) {
    this.addAttachmentButtonClick = true;    
    const fd = new FormData();
    fd.append('image', event.target.files[0], event.target.files[0].name);

    const uploadUrl = `${environment.apiUploadUrl}`;
    const params = new HttpParams()
    .set('destFolder', `${environment.uploadFolders.catalogs}/checklist-templates-lines`)
    .set('processId', this.line.variableId)
    .set('process', originProcess.CATALOGS_CHECKLIST_TEMPLATE_LINES_ATTACHMENTS);
    this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
      if (res) {
        const message = $localize`El adjunto ha sido subido satisfactoriamente<br>`;
        this._sharedService.showSnackMessage({
          message,
          duration: 3000,
          snackClass: 'snack-primary',
          icon: 'check',
        });
        this.line.attachments.push({
          index: this.line.attachments.length,
          name: res.fileName, 
          id: res.fileGuid, 
          image: `${environment.serverUrl}/files/${res.filePath}`, 
          icon: this._catalogsService.setIconName(res.fileType), 
        })
        this.attachmentsTable = new MatTableDataSource<Attachment>(this.line.attachments);    
        this.setEditionButtonsState();
        this.setAttachmentLabel();
        this.addAttachmentButtonClick = false;
      }      
    });    
  }

  handleRemoveAllAttachments() {
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`Eliminar todos los adjuntos`,  
        topIcon: 'garbage-can',
        defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
        buttons: [],
        body: {
          message: $localize`Esta acción quitará todos los adjuntoas del registro.<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {      
      if (response.action === ButtonActions.OK) {
        this.line.attachments = [];
        this.attachmentsTable = new MatTableDataSource<Attachment>(this.line.attachments);    
        this.setEditionButtonsState();
        this.setAttachmentLabel();
      }
    });       
  }    

  setAttachmentLabel() {
    if (!this.line.attachments || this.line.attachments?.length === 0) {
      this.variableAttachmentLabel = $localize`Este registro no tiene adjuntos...`;
    } else {
      this.variableAttachmentLabel = $localize`Este registro tiene ${this.line.attachments.length} adjunto(s)...`;
    }
  }

  handleAttachmentDownload(id: number) {
    const downloadUrl = `${environment.apiDownloadUrl}`;
    const params = new HttpParams()
    .set('fileName', this.line.attachments[id].image.replace(`${environment.serverUrl}/files/`, ''))
    this.downloadFiles = this._http.get(downloadUrl, { params, responseType: 'blob' }).subscribe((res: any) => {
      if (res) {
        let url = window.URL.createObjectURL(res);
        let link = document.createElement("a"); 
        link.download = this.line.attachments[id].name;
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();    
      }      
    });
  }

  duplicateAttachments() {
    if (this.line.attachments.length === 0) return

    const files = this.line.attachments.map((a) => a.id);
    this.duplicateAttachmentsList$ = this._catalogsService.duplicateAttachmentsList$(originProcess.CATALOGS_CHECKLIST_TEMPLATE_LINES_ATTACHMENTS, files)
    .pipe(
      tap((newAttachments) => {
        if (newAttachments.data.duplicateAttachments.length !== this.line.attachments) {
          const message = $localize`No se pudieron duplicar todos los adjuntos...`;
          this._sharedService.showSnackMessage({
            message,
            snackClass: 'snack-warn',
            progressBarColor: 'warn',
            icon: 'delete',
          });
        }
        let line = 0;
        this.line.attachments = newAttachments.data.duplicateAttachments.sort((a, b) => a.index - b.index).map(na => {
          return {
            index: line++,
            name: na.fileName, 
            image: `${environment.serverUrl}/files/${na.path}`, 
            id: na.fileId, 
            icon: this._catalogsService.setIconName(na.fileType), 
          }
        });
        this.attachmentsTable = new MatTableDataSource<Attachment>(this.line.attachments);
        this.setAttachmentLabel();
      })

    )
  }

  validateTables(): void {
    if (this.variableForm.controls.valueType.value === HarcodedVariableValueType.LIST) {
      if (this.line.valuesList.length === 0) {
        this.variableForm.controls.possibleValues.setErrors({ inactive: true });   
      } else {
        this.variableForm.controls.possibleValues.setErrors(null);   
      }
    } else {
      this.variableForm.controls.possibleValues.setErrors(null);   
    }
    if (this.variableForm.controls.notifyAlarm.value === GeneralValues.YES && this.variableForm.controls.recipient.value && this.variableForm.controls.recipient.value.status === RecordStatus.INACTIVE) {
      this.variableForm.controls.recipient.setErrors({ inactive: true });   
    } else {
      this.variableForm.controls.recipient.setErrors(null);   
    }
    this.line.validate = false;
    // It is missing the validation for state and thresholdType because we dont retrieve the complete record but tghe value
  }

  setEditionButtonsState() {
    this.formChange.emit({ lineNumber: this.line.line, formData: this.variableForm.controls });      
  }

  get SystemTables () {
    return SystemTables;
  }

  get ScreenDefaultValues () {
    return ScreenDefaultValues;
  }

  get GeneralValues() {
    return GeneralValues; 
  }
  
  get HarcodedVariableValueType() {
    return HarcodedVariableValueType; 
  }

  get RecordStatus() {
    return RecordStatus; 
  }
// End ======================
}
