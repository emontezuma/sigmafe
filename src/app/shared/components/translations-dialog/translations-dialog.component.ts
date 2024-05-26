import { Component, Inject, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { EMPTY, Observable, Subscription, catchError, fromEvent, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../state/app.state'; 
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { SettingsData } from '../../models/settings.models';
import { SharedService } from '../../services/shared.service';
import { SmallFont, SpinnerFonts, SpinnerLimits } from '../../models/colors.models';
import { ButtonActions, dialogByDefaultButton, toolbarMode } from '../../models/screen.models';
import { FormControl, FormGroup } from '@angular/forms';
import { dissolve } from '../../../shared/animations/shared.animations';
import {  GeneralHardcodedValuesData, emptyGeneralHardcodedValuesData } from 'src/app/catalogs';
import { RecordStatus } from '../../models/helpers.models';
import { GenericDialogComponent } from '../generic-dialog';

@Component({
  selector: 'app-translations-dialog',
  templateUrl: './translations-dialog.component.html',
  animations: [ dissolve, ],
  styleUrls: ['./translations-dialog.component.scss']
})
export class TranslationsDialogComponent implements OnDestroy, AfterViewInit {
  @ViewChild('translationsDialog') translationsDialog: ElementRef;
  
// Variables ================
  defaultButtonIcons: string[] = [
    'check',
    'cancel',
  ];
  loading: boolean = false;
  settingsData$: Observable<SettingsData>;
  everySecond$: Observable<boolean>;
  settingsData: SettingsData;
  closed: boolean = false;
  timeOutforDefaultButton: number = 0;
  timeOutFortDialog: number = 0;
  selectedTranslation: any;
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

  translationsFormSubscription: Subscription;
  translationsForm = new FormGroup({
    description: new FormControl(''),
    reference: new FormControl(''),
    notes: new FormControl(''),    
    language: new FormControl(''),    
  });
  languages$: Observable<any>; 
  languages: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData;    
  takeRecords: number = 50;
  keypressSubscription: Subscription;

  constructor (
    private _store: Store<AppState>,
    public _dialogRef: MatDialogRef<TranslationsDialogComponent>,
    public _sharedService: SharedService,
    public _dialog: MatDialog,   
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

// Hooks ====================
  ngOnInit() : void {
    this.settingsData$ = this._store.select(selectSettingsData).pipe(
      tap( settingsData => {
        this.settingsData = settingsData;
        this.takeRecords = this.settingsData.catalog?.pageSize || 50
        this.getLanguages();
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
    this.printTranslations();
   }

   ngAfterViewInit(): void {
    this.keypressSubscription = fromEvent(this.translationsDialog.nativeElement, 'keyup').subscribe((event: KeyboardEvent) => {
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
    this.translationsFormSubscription = this.translationsForm.valueChanges.subscribe((moldFormChanges: any) => {      
      this.setButtonState(toolbarMode.EDITING_WITH_DATA)      
    });    
  }

  ngOnDestroy(): void {
    if (this.translationsFormSubscription) this.translationsFormSubscription.unsubscribe();      
    if (this.keypressSubscription) this.keypressSubscription.unsubscribe();
  }
  
// Functions ================
  trackByFn(index: any, item: any) { 
    return index; 
  }

  handleClick(action: string) {
    this.data.buttons.find(b => b.action === action).loading = true;
    if (action === ButtonActions.SAVE) {
      if (!this.translationsForm.controls.description.value?.trim() && !this.translationsForm.controls.reference.value?.trim() && this.translationsForm.controls.notes.value?.trim()) {
        this.translationsForm.controls.description.setErrors({ 'incorrect': true })
      } else {       
        let translation = this.data.translations.find(f => f.languageId === this.translationsForm.controls.language.value);
        if (!translation) {
          this.data.translations.push({ languageId: this.translationsForm.controls.language.value, description: '', notes: '', reference: '', changed: true, updatedAt: '', updatedByUserName: '', });
          translation = this.data.translations.find(f => f.languageId === this.translationsForm.controls.language.value);
        }
        translation.description = this.translationsForm.controls.description.value;
        translation.reference = this.translationsForm.controls.reference.value;
        translation.notes = this.translationsForm.controls.notes.value;
        translation.updatedAt = this._sharedService.formatDate(new Date());
        translation.updatedByUserName = $localize`Este usuario`;
        translation.changed = true;
      }
      const message = $localize`Se registra la traducción, debe guardar el registro para actualizar la base de datos`;
      this._sharedService.showSnackMessage({
        message,
        snackClass: 'snack-primary',
      });
      this.languageIsUsed(+this.translationsForm.controls.language.value);
      this.printTranslations();
      this.setButtonState(toolbarMode.INITIAL_WITH_DATA);
      this.data.translationsUpdated = true;
    } else if (action === ButtonActions.CANCEL) {
      const translation = this.data.translations.find(f => f.languageId === this.translationsForm.controls.language.value);
      if (translation) {        
        this.translationsForm.controls.description.setValue(translation['description']);
        this.translationsForm.controls.reference.setValue(translation['reference']);
        this.translationsForm.controls.notes.setValue(translation['notes']);
        translation['changed'] = false;
        this.setButtonState(toolbarMode.INITIAL_WITH_DATA);
      } else {
        this.translationsForm.controls.description.setValue('');
        this.translationsForm.controls.reference.setValue('');
        this.translationsForm.controls.notes.setValue('');
        this.setButtonState(toolbarMode.INITIAL_WITH_NO_DATA);
      }      
    } else if (action === ButtonActions.CLOSE) {      
      this.handleCloseButtonClick()
    } else if (action === ButtonActions.DELETE) {
      const dialogResponse = this._dialog.open(GenericDialogComponent, {
        width: '450px',
        disableClose: true,            
        panelClass: 'warn-dialog',
        autoFocus : true,
        data: {
          title: $localize`Eliminar traducción`,
          topIcon: 'warn-fill',
          defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
          buttons: [],
          body: {
            message: $localize`Esta acción eliminará la traducción seleccionada y ya no estará disponible.<br><br><strong>¿Desea continuar?</strong>.`,
          },
          showCloseButton: true,
        },
      }); 
      dialogResponse.afterClosed().subscribe((response) => {
        if (response.action === ButtonActions.OK) {
          const message = $localize`Se ha eliminado la traducción para el lenguaje indicado`;
          this._sharedService.showSnackMessage({
            message,                  
            snackClass: 'snack-warn',
          });
          this.data.translations =  this.data.translations.filter(translation => translation.languageId !== +this.translationsForm.controls.language.value);
          this.selectedTranslation = null;
          this.printTranslations();
          this.translationsForm.controls.description.setValue('');
          this.translationsForm.controls.reference.setValue('');
          this.translationsForm.controls.notes.setValue('');
          this.setButtonState(toolbarMode.INITIAL_WITH_NO_DATA);
          this.languageIsUsed(+this.translationsForm.controls.language.value);
          this.data.translationsUpdated = true;
        }
      });                 
    }
    setTimeout(() => {
      this.data.buttons.find(b => b.action === action).loading = false;
    }, 200);
  }

  handleCloseButtonClick() {
    this.closed = true;
    this.data.action = 'close'; 
    this._dialogRef.close(this.data);
  }

  getLanguages() {
    const filterBy = JSON.parse(`{ "status": { "eq": "${RecordStatus.ACTIVE}" } }`);
    const orderBy = JSON.parse(`{ "id": "${'ASC'}" }`); 
    let variables = undefined;
    if (variables) {         
      variables = { ...variables, recosrdsToTake: this.takeRecords };
    } else {
      variables = { recosrdsToTake: this.takeRecords };
    }      
    if (variables) {         
      variables = { ...variables, orderBy };
    } else {
      variables = { orderBy  };
    }
    if (variables) {         
      variables = { ...variables, filterBy };
    } else {
      variables = { filterBy };
    }    
    this.languages$ = this._sharedService.getlanguagesLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {
        if (data?.data?.languages?.items.length === 0) {
          const message = $localize`No hay lenguajes cargados en el sistema.\nComuníquese con su proveedor de Sigma`;
          this._sharedService.showSnackMessage({
            message,                  
            snackClass: 'snack-warn',            
          });
          this.data.action = 'no-languages';
          this._dialogRef.close(this.data);
        }
        this.languages = {
          ...data?.data?.languages,
          items: data?.data?.languages?.items.map((item) => {
            return {
              id: item.id,
              value: item.id,
              friendlyText: item.name,
              mainImagePath: item.mainImagePath,
              status: item.status,
              used: !!this.data.translations.find(t => t.languageId === item.id),
            }
          }),
        };
        if (this.data.translations.length === 0) {
          this.setLanguage(this.languages.items[0].id);
        } else {
          this.setLanguage(this.data.translations[0].languageId);
        }
      }),
      catchError(() => EMPTY)
    )      
  } 

  languageIsUsed(id: number) {
    this.languages.items.find(l => l.id === id).used = !!this.data.translations.find(t => t.languageId === id);
  }

  onSubmit() { }

  setLanguage(id: any) {    
    let languageId = id;
    if (id.value) {
      languageId = id.value;
    }
    this.selectedTranslation = this.data.translations.find(f => f.languageId === languageId);
    this.translationsForm.controls.language.setValue(languageId);
    if (this.selectedTranslation) {
      this.translationsForm.controls.description.setValue(this.selectedTranslation.description);
      this.translationsForm.controls.reference.setValue(this.selectedTranslation.reference);
      this.translationsForm.controls.notes.setValue(this.selectedTranslation.notes);
      this.setButtonState(toolbarMode.INITIAL_WITH_DATA);
    } else {
      const message = $localize`Nueva traducción...`;
      this._sharedService.showSnackMessage({
        message,
        snackClass: 'snack-primary',
      });
      this.translationsForm.controls.description.setValue('');
      this.translationsForm.controls.reference.setValue('');
      this.translationsForm.controls.notes.setValue('');
      this.setButtonState(toolbarMode.INITIAL_WITH_NO_DATA);
    }
  }

  setButtonState(state: toolbarMode) {
    if (state === toolbarMode.INITIAL_WITH_DATA && !this.data.buttons.find((button : any) => button.action === ButtonActions.SAVE).disabled) {
      this.data.buttons.find((button : any) => button.action === ButtonActions.SAVE).disabled = true;
      this.data.buttons.find((button : any) => button.action === ButtonActions.CANCEL).disabled = true;    
      this.data.buttons.find((button : any) => button.action === ButtonActions.DELETE).disabled = false;    
    } else if (state === toolbarMode.INITIAL_WITH_NO_DATA && !this.data.buttons.find((button : any) => button.action === ButtonActions.SAVE).disabled) {
      this.data.buttons.find((button : any) => button.action === ButtonActions.SAVE).disabled = true;
      this.data.buttons.find((button : any) => button.action === ButtonActions.CANCEL).disabled = true;    
      this.data.buttons.find((button : any) => button.action === ButtonActions.DELETE).disabled = true;    
    } else if (state === toolbarMode.EDITING_WITH_DATA  && this.data.buttons.find((button : any) => button.action === ButtonActions.SAVE).disabled) {
      this.data.buttons.find((button : any) => button.action === ButtonActions.SAVE).disabled = false;
      this.data.buttons.find((button : any) => button.action === ButtonActions.CANCEL).disabled = false;
    }
  }

  printTranslations() {
    if (this.data.translations.length === 0) {
      this.data.bottomMessage = $localize`No hay traducciones para este registro`;  
    } else {
      this.data.bottomMessage = $localize`El registro tiene <strong>${this.data.translations.length}</strong> traducción(es)`;
    }    
  }

// End ======================
}