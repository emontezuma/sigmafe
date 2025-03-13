import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router'; 
import { Location } from '@angular/common'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, GoTopButtonStatus, PageInfo, ProfileData, RecordStatus, SettingsData, ToolbarButtonClicked, ToolbarElement, dialogByDefaultButton, originProcess, SystemTables, toolbarMode, ScreenDefaultValues, GeneralValues, GeneralCatalogParams, GeneralHardcodedValuesData, emptyGeneralHardcodedValuesData } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AppState, selectSettingsData } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import { EMPTY, Observable, Subscription, catchError, combineLatest, map, of, skip,  tap } from 'rxjs';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from '@angular/forms';
import { CatalogsService } from '../../services';
import { UserItem, emptyUserItem } from '../../models';
import { UserDetail } from '../../../shared/models';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

import { GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';
import { emptyGeneralCatalogData, emptyGeneralCatalogItem, emptyGeneralHardcodedValuesItem, GeneralCatalogData } from '../../models/catalogs-shared.models';
import { CustomValidators } from '../../custom-validators';

@Component({
  selector: 'app-catalog-user-edition',
  templateUrl: './catalog-user-edition.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-user-edition.component.scss']
})
export class CatalogUserEditionComponent {
  @ViewChild('catalogEdition') private catalogEdition: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild('f') private thisForm: NgForm;

  // Users ===============
  user: UserDetail = emptyUserItem;
  scroll$: Observable<any>;;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>; 

  approvers$: Observable<any>; 
  approvers: GeneralCatalogData = emptyGeneralCatalogData; 
  approversOrder: any = JSON.parse(`{ "data": { "name": "${'ASC'}" } }`);
  duplicateMainImage$: Observable<any>; 
  
  valueTypeChanges$: Observable<any>;
  
  toolbarClick$: Observable<ToolbarButtonClicked>; 
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  user$: Observable<UserDetail>;
  translations$: Observable<any>;
  updateUser$: Observable<any>;
  updateUserCatalog$: Observable<any>;
  deleteUserTranslations$: Observable<any>;  
  addUserTranslations$: Observable<any>;  
  
  userFormChangesSubscription: Subscription;
  
  uploadFiles: Subscription;
  
  catalogIcon: string = "admin";  
  today = new Date();  
  order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);
  harcodedValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);
  storedTranslations: [] = [];
  translationChanged: boolean = false
  imageChanged: boolean = false
  submitControlled: boolean = false
  loading: boolean;
  elements: ToolbarElement[] = [];  
  panelOpenState: boolean[] = [true, false, false];
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  userData: UserItem;  
  goTopButtonTimer: any;
  takeRecords: number;
  focusThisField: string = '';
  roles$: Observable<any>;
  roles: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData;
          
  passwordPolicies$: Observable<any>;
  passwordPolicies: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData;
  

  userForm = new FormGroup({
    name: new FormControl(
      '', 
      Validators.required,      
    ),       
    mainImageName: new FormControl(''),    
    email: new FormControl(''),        
    approver: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),   
    roles: new FormControl(emptyGeneralHardcodedValuesItem),          
    passwordPolicy: new FormControl(emptyGeneralHardcodedValuesItem),          
  });

  pageInfo: PageInfo = {
    currentPage: 0,
    totalRecords:  0,
    totalPages: 0,
    inactiveRecords: 0,
    activeRecords: 0,
  }
  
  // Temporal
  tmpDate: number = 112;
  loaded: boolean = false;

  
  constructor(
    private _store: Store<AppState>,
    public _sharedService: SharedService,
    private _catalogsService: CatalogsService,
    private _router: Router,
    public _scrollDispatcher: ScrollDispatcher,
    private _route: ActivatedRoute,
    private _http: HttpClient,
    public _dialog: MatDialog,
    private _location: Location,
  ) {}

// Hooks ====================
  ngOnInit() {
    this.pageAnimationFinished();
    this.requestRolesData(0);   
    this.requestPasswordPoliciesData(0);   
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
      true,
    );
    this.showGoTop$ = this._sharedService.showGoTop.pipe(
      tap((goTop) => {
        if (goTop.status === 'temp') {
          this.onTopStatus = 'active';
          this.catalogEdition.nativeElement.scrollIntoView({            
            behavior: 'smooth',
            block: 'start',
          });
          // Ensure
        }      
      })
    );
    this.scroll$ = this._scrollDispatcher
    .scrolled()
    .pipe(
      tap((data: any) => {      
        this.getScrolling(data);
      })
    );  
    this.settingsData$ = this._store.select(selectSettingsData).pipe(
      tap(settingsData => {
        this.settingsData = settingsData;
        this.takeRecords = this.settingsData.catalog?.pageSize || 50
        const currentPage = 0;

      })
    );
    this.userFormChangesSubscription = this.userForm.valueChanges.subscribe((userFormChanges: any) => {
      if (!this.loaded) return;
      this.setEditionButtonsState();
    }); 
    this.toolbarAnimationFinished$ = this._sharedService.toolbarAnimationFinished.pipe(
      tap((animationFinished: boolean) => {
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
          !animationFinished,
        ); 
      }
    ));    
    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      skip(1),
      tap((buttonClicked: ToolbarButtonClicked) => {      
        if (buttonClicked.from !== ApplicationModules.EQUIPMENTS_CATALOG_EDITION) {
            return
        }
        this.toolbarAction(buttonClicked);
      }
    ));
    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.requestUserData(+params['id']);
        }
      })
    ); 
    this.calcElements();
   
    setTimeout(() => {
      this.focusThisField = 'name';
      this.loaded = true;
    }, 200); 
    
  }

  ngOnDestroy() : void {
    this._sharedService.setToolbar({
      from: ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
      false,
    );
    if (this.uploadFiles) this.uploadFiles.unsubscribe();
    if (this.userFormChangesSubscription) this.userFormChangesSubscription.unsubscribe(); 
  }
  
// Functions ================

  // pageAnimationFinished(e: any) {
  pageAnimationFinished() {
    // if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this._sharedService.setToolbar({
          from: ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
          show: true,
          buttonsToLeft: 1,
          showSpinner: false,
          toolbarClass: 'toolbar-grid',
          dividerClass: 'divider',
          elements: this.elements,
          alignment: 'right',
        });        
      }, 10);
    // }
  }

  toolbarAction(action: ToolbarButtonClicked) {
    if (action.from === ApplicationModules.EQUIPMENTS_CATALOG_EDITION && this.elements.length > 0) {
      if (action.action === ButtonActions.NEW) {        
        this.elements.find(e => e.action === action.action).loading = true;
        if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`Cambios sin guardar`,  
              topIcon: 'warn_fill',
              defaultButtons: dialogByDefaultButton.ACCEPT,
              buttons: [],
              body: {
                message: $localize`Existen cambios sin guardar, primero <strong>cancele la edición actual</strong> y luego reinicie el formulario.`,
              },
              showCloseButton: true,
            },
          }); 
          dialogResponse.afterClosed().subscribe((response) => {
            this.elements.find(e => e.action === action.action).loading = false;
          });    
        } else {
          this._location.replaceState('/catalogs/users/create');
          this.initForm();
          this.elements.find(e => e.action === action.action).loading = false;  
        }
      } else if (action.action === ButtonActions.BACK) {               
        this.elements.find(e => e.action === action.action).loading = true;
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this._router.navigateByUrl('/catalogs/users'); 
        }, 750);
      } else if (action.action === ButtonActions.COPY) {               
        this.elements.find(e => e.action === action.action).loading = true;
        this.initUniqueField();
        this.duplicateMainImage();
        this._location.replaceState('/catalogs/users/create');
        this.focusThisField = 'name';
        setTimeout(() => {
          this.focusThisField = '';
        }, 100);
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
        }, 750);
      } else if (action.action === ButtonActions.SAVE) {        
        this.elements.find(e => e.action === action.action).loading = true;
        this.submitControlled = true;
        this.thisForm.ngSubmit.emit();
        setTimeout(() => {          
          this.elements.find(e => e.action === action.action).loading = false;
        }, 200);
      } else if (action.action === ButtonActions.CANCEL) {         
        this.elements.find(e => e.action === action.action).loading = true;
        let noData = true;
        if (!this.user.id || this.user.id === null || this.user.id === 0) {
          this.initForm();
        } else {
          noData = false;
          this.requestUserData(this.user.id);
        }
        const message = $localize`Edición cancelada`;
          this._sharedService.showSnackMessage({
            message,      
            snackClass: 'snack-primary',
          });
        setTimeout(() => {
          if (noData) {
            this.setToolbarMode(toolbarMode.INITIAL_WITH_NO_DATA);
          } else {
            this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);
          }
          this.elements.find(e => e.action === action.action).loading = false;
        }, 200);
      } else if (action.action === ButtonActions.INACTIVATE) { 
        this.elements.find(e => e.action === action.action).loading = true;
        if (this.user?.id > 0 && this.user.status === RecordStatus.ACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`INACTIVAR USUARIO`,  
              topIcon: 'delete',
              buttons: [{
                action: 'inactivate',
                showIcon: true,
                icon: 'delete',
                showCaption: true,
                caption: $localize`Inactivar`,
                showTooltip: true,
                class: 'warn',
                tooltip: $localize`Inactiva el registro`,
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
                message: $localize`Esta acción inactivará El Usuario con el Id <strong>${this.user.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: true,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            if (response.action === 'cancel') {
              setTimeout(() => {
                this._sharedService.actionCancelledByTheUser();
                this.elements.find(e => e.action === action.action).loading = false;
              }, 200); 
            } else {
              this.elements.find(e => e.action === action.action).loading = true;
              const userParameters = {
                settingType: 'status',
                id: this.user.id,
                customerId: this.user.customerId,
                status: RecordStatus.INACTIVE,
              }
              const users = this._sharedService.setGraphqlGen(userParameters);
              this.updateUser$ = this._catalogsService.updateUserStatus$(users)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateUser.length > 0 && data?.data?.createOrUpdateUser[0].status === RecordStatus.INACTIVE) {
                    setTimeout(() => {
                      this.changeInactiveButton(RecordStatus.INACTIVE)
                      const message = $localize`El Usuario ha sido inhabilitado`;
                      this.user.status = RecordStatus.INACTIVE;
                      this._sharedService.showSnackMessage({
                        message,
                        snackClass: 'snack-warn',
                        progressBarColor: 'warn',
                        icon: 'delete',
                      });
                      this.elements.find(e => e.action === action.action).loading = false;
                    }, 200);
                  }
                })
              )
            }            
          });
        } else if (this.user?.id > 0 && this.user.status === RecordStatus.INACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            autoFocus : true,
            data: {
              title: $localize`REACTIVAR USUARIO`,  
              topIcon: 'check',
              buttons: [{
                action: 'reactivate',
                showIcon: true,
                icon: 'check',
                showCaption: true,
                caption: $localize`Reactivar`,
                showTooltip: true,
                class: 'primary',
                tooltip: $localize`Reactiva el registro`,
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
                message: $localize`Esta acción reactivará El Usuario con el Id <strong>${this.user.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: true,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            if (response.action === 'cancel') {
              setTimeout(() => {
                this._sharedService.actionCancelledByTheUser();
                this.elements.find(e => e.action === action.action).loading = false;
              }, 200); 
            } else {
              this.elements.find(e => e.action === action.action).loading = true;
              const userParameters = {
                settingType: 'status',
                id: this.user.id,
                customerId: this.user.customerId,
                status: RecordStatus.ACTIVE,
              }
              const users = this._sharedService.setGraphqlGen(userParameters);
              this.updateUser$ = this._catalogsService.updateUserStatus$(users)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateUser.length > 0 && data?.data?.createOrUpdateUser[0].status === RecordStatus.ACTIVE) {
                    setTimeout(() => {                      
                      this.changeInactiveButton(RecordStatus.ACTIVE)
                      const message = $localize`El Usuario ha sido reactivada`;
                      this.user.status = RecordStatus.ACTIVE;
                      this._sharedService.showSnackMessage({
                        message,
                        snackClass: 'snack-primary',
                        progressBarColor: 'primary',
                        icon: 'check',
                      });
                      this.elements.find(e => e.action === action.action).loading = false;
                    }, 200);
                  }
                })
              )
            }            
          });
        }
      } else if (action.action === ButtonActions.RESET) { 
        this.elements.find(e => e.action === action.action).loading = true;        
        const dialogResponse = this._dialog.open(GenericDialogComponent, {
          width: '450px',
          disableClose: true,
          autoFocus : true,
          data: {
            title: $localize`REINICIAR CONTRASEÑA`,  
            topIcon: 'encryption',
            buttons: [{
              action: 'Reiniciar',
              showIcon: true,
              icon: 'check',
              showCaption: true,
              caption: $localize`Reiniciar contraseña`,
              showTooltip: true,
              class: 'warn',
              tooltip: $localize`Reinicia la contraseña del usuario`,
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
              message: $localize`Esta acción reiniciará la contraseña del usuario.<br><br><strong>¿Desea continuar?</strong>`,
            },
            showCloseButton: true,
          },
        });
        dialogResponse.afterClosed().subscribe((response) => {
          if (response.action === 'cancel') {
            setTimeout(() => {
              this._sharedService.actionCancelledByTheUser();
              this.elements.find(e => e.action === action.action).loading = false;
            }, 200); 
          } else {
            this.elements.find(e => e.action === action.action).loading = true;
            const userParameters = {
              settingType: 'initPassword',
              id: this.user.id,
              customerId: this.user.customerId,
              initialized: 'y',
            }
            const users = this._sharedService.setGraphqlGen(userParameters);
            this.updateUser$ = this._catalogsService.updateUserPassword$(users)
            .pipe(
              tap((data: any) => {
                if (data?.data?.createOrUpdateUser.length > 0) {
                  setTimeout(() => {
                    this.changeInactiveButton(RecordStatus.INACTIVE)
                    const message = $localize`La contraseña del usuairo se ha reiniciado`;
                    this.user.status = RecordStatus.INACTIVE;
                    this._sharedService.showSnackMessage({
                      message,
                      snackClass: 'snack-warn',
                      progressBarColor: 'warn',
                      icon: 'encryption',
                    });
                    this.elements.find(e => e.action === action.action).loading = false;
                  }, 200);
                }
              })
            )
          }            
        });                
      } else if (action.action === ButtonActions.TRANSLATIONS) { 
        if (this.user?.id > 0) {
          const dialogResponse = this._dialog.open(TranslationsDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
              duration: 0,
              translationsUpdated: false,
              title: $localize`Traducciones del Usuario <strong>${this.user.id}</strong>`,
              topIcon: 'world',
              translations: this.user.translations,
              buttons: [{
                action: ButtonActions.SAVE,
                showIcon: true,
                icon: 'save',
                showCaption: true,
                caption: $localize`Registrar`,
                showTooltip: true,
                class: 'primary',
                tooltip: $localize`Registra las traducciones`,
                default: true,
                disabled: true,
              }, {
                action: ButtonActions.CANCEL,
                showIcon: true,
                icon: 'cancel',
                showCaption: true,
                caption: $localize`Cancelar`,
                showTooltip: true,                            
                tooltip: $localize`Cancela la edición actual`,    
                disabled: true,
              }, {
                action: ButtonActions.DELETE,
                showIcon: true,
                icon: 'garbage_can',
                showCaption: true,
                caption: $localize`Eliminar`,
                showTooltip: true,            
                class: 'warn',
                tooltip: $localize`Elimina la traducción`,    
                disabled: true,
              }, {
                action: ButtonActions.CLOSE,
                showIcon: true,
                icon: 'cross',
                showCaption: true,
                caption: $localize`Cerrar`,
                showTooltip: true,            
                tooltip: $localize`Cierra ésta ventana`,
                cancel: true,
              }],
              body: {
                message: $localize`Esta acción inactivará al USUARIO ${this.user.id} y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: false,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            this.translationChanged = response.translationsUpdated
            if (response.translationsUpdated) {              
              //this._store.dispatch(updateMoldTranslations({ 
              this.user.translations = [...response.translations];
              //}));
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.user.translations?.length > 0 ? $localize`Traducciones (${this.user.translations?.length})` : $localize`Traducciones`;
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.user.translations?.length > 0 ? 'accent' : '';   
              this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
            }
          });
        }
      }
    }
  }

  calcElements() {
    this.elements = [{
      type: 'button',
      caption: $localize`Regresar...`,
      tooltip:  $localize`Regresar a la lista de usuarios`,
      icon: 'arrow_left',
      class: 'primary',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      alignment: 'left',
      showCaption: true,
      loading: false,
      disabled: false,
      visible: true,
      action: ButtonActions.BACK,
    },{
      type: 'button',
      caption: $localize`Inicializar`,
      tooltip:  $localize`Inicializa la pantalla actual`,
      icon: 'document',
      class: '',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
      visible: true,
      action: ButtonActions.NEW,
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: '',
      class: '',
      iconSize: '',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
            visible: true,
      action: undefined,
    },{
      type: 'button',
      caption: $localize`Guardar`,
      tooltip: $localize`Guarda los cambios...`,
      class: '',
      icon: 'save',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
            visible: true,
      elementType: 'submit',
      action: ButtonActions.SAVE,
    },{
      type: 'button',
      caption: $localize`Cancelar`,
      tooltip: $localize`Cancela los cambios`,
      class: '',
      icon: 'cancel',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
            visible: true,
      action: ButtonActions.CANCEL,
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: '',
      class: '',
      iconSize: '',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
            visible: true,
      action: undefined,
    },{
      type: 'button',
      caption: $localize`Copiar`,
      tooltip: $localize`Copia los datos actuales para un nuevo registro...`,
      class: '',
      icon: 'copy',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
            visible: true,
      action: ButtonActions.COPY,
    },{
      type: 'button',
      caption: $localize`Inactivar`,
      tooltip: $localize`Inactivar el registro...`,
      class: '',
      icon: 'delete',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: this.user?.status !== RecordStatus.ACTIVE,
      visible: true,
      action: ButtonActions.INACTIVATE,      
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: '',
      class: '',
      iconSize: '',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
            visible: false,
      action: undefined,
    },{
      type: 'button',
      caption: $localize`Reiniciar contraseña`,
      tooltip: $localize`Reinicia la contraseña del usuario...`,
      class: '',
      icon: 'encryption',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: this.user?.status === RecordStatus.ACTIVE,
      visible: true,
      action: ButtonActions.RESET,      
    },{
      type: 'button',
      caption: $localize`Traducciones`,
      tooltip: $localize`Agregar traducciones al registro...`,
      class: '',
      icon: 'world',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: !!!this.user.id,
      visible: false,
      action: ButtonActions.TRANSLATIONS,      
    },];
  }

  getScrolling(data: CdkScrollable) {       
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0; 
    let status = 'inactive'
    if (scrollTop < 5) {
      status = 'inactive';
    } else if (this.onTopStatus !== 'temp') {
      status = 'active';
      clearTimeout(this.goTopButtonTimer);
      this.goTopButtonTimer = setTimeout(() => {
        if (this.onTopStatus !== 'inactive') {
          this.onTopStatus = 'inactive';
          this._sharedService.setGoTopButton(
            ApplicationModules.GENERAL,
            'inactive',
          );
        }
        return;
      }, 2500);
    }    
    if (this.onTopStatus !== status) {
      this.onTopStatus = status;
      this._sharedService.setGoTopButton(
        ApplicationModules.GENERAL,
        status,
      );
    }
  }

  onSubmit() {
    if (!this.submitControlled) return;
    this.submitControlled = false;
    this.validateTables();
    this.userForm.markAllAsTouched();
    this.userForm.updateValueAndValidity(); 
    if (this.userForm.valid) {      
      this.saveRecord();   
    } else {
      let fieldsMissing = '';
      let fieldsMissingCounter = 0;
      for (const controlName in this.userForm.controls) {
        if (this.userForm.controls.hasOwnProperty(controlName)) {
          const typedControl: AbstractControl = this.userForm.controls[controlName]; 
          if (typedControl.invalid) {
            fieldsMissingCounter++;
            fieldsMissing += `<strong>${fieldsMissingCounter}.</strong> ${this.getFieldDescription(controlName)}<br>`;
          }
        }
      }
      const dialogResponse = this._dialog.open(GenericDialogComponent, {
        width: '450px',
        disableClose: true,
        panelClass: 'warn-dialog',
        autoFocus : true,
        data: {
          title: $localize`DATOS INVÁLIDOS`,
          topIcon: 'warn_fill',
          defaultButtons: dialogByDefaultButton.ACCEPT,
          buttons: [],
          body: {
            message: $localize`El formulario contiene campos requeridos que deben llenarse o campos con datos incorrectos.<br>${fieldsMissing}`,
          },
          showCloseButton: true,
        },
      }); 
      dialogResponse.afterClosed().subscribe((response) => {
        let fieldFocused = false;
        for (const controlName in this.userForm.controls) {
          if (this.userForm.controls.hasOwnProperty(controlName)) {
            const typedControl: AbstractControl = this.userForm.controls[controlName]; 
            if (typedControl.invalid) {
              if (!fieldFocused) {
                this.focusThisField = controlName;
                setTimeout(() => {
                  this.focusThisField = '';
                }, 100)
                break;
              }
              fieldsMissingCounter++;
              fieldsMissing += `<strong>${fieldsMissingCounter}.</strong> ${this.getFieldDescription(controlName)}<br>`;
            }
          }
        }
        setTimeout(() => {
          this.elements.find(e => e.action === ButtonActions.SAVE).loading = false;
        }, 100);
      });
    }
  }

  saveRecord() {
    this.setViewLoading(true);
    const newRecord = !this.user.id || this.user.id === null || this.user.id === 0;
    try {
      const dataToSave = this.prepareRecordToSave(newRecord);
      this.updateUserCatalog$ = this._catalogsService.updateUserCatalog$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateUser.length > 0) {
            const userId = data?.data?.createOrUpdateUser[0].id;          
            this.processTranslations$(userId).subscribe(() => {
              this.requestUserData(userId);
              setTimeout(() => {              
                let message = $localize`El Usuario ha sido actualizado`;
                if (newRecord) {                
                  message = $localize`El Usuario ha sido creado satisfactoriamente con el id <strong>${this.user.id}</strong>`;
                  this._location.replaceState(`/catalogs/users/edit/${userId}`);
                }
                this._sharedService.showSnackMessage({
                  message,
                  snackClass: 'snack-accent',
                  progressBarColor: 'accent',                
                });
                this.setViewLoading(false);
                this.elements.find(e => e.action === ButtonActions.SAVE).loading = false;
              }, 200);
            });
          }
        })
      )
    } catch (error) {
      const message = $localize`Se generó un error al procesar el registro. Error: ${error}`;
      this._sharedService.showSnackMessage({
        message,
        duration: 5000,
        snackClass: 'snack-warn',
        icon: 'check',
      }); 
      this.setViewLoading(false);
      this.elements.find(e => e.action === ButtonActions.SAVE).loading = false;    
    } 
    
  }

  requestApproversData(currentPage: number, filterStr: string = null) {    
    this.approvers = {
      ...this.approvers,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "data": { "name": { "contains": "${filterStr}" } } } ] }`);
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }
    const skipRecords = this.approvers.items.length;

    const variableParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.approversOrder,
    }    
    const variables = this._sharedService.setGraphqlGen(variableParameters); 
    this.approvers$ = this._catalogsService.getApproversLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.usersPaginated?.items.map((item) => {
          return {
            isTranslated: true,
            translatedName: item.data.name,
            translatedReference: item.data.reference,
            id: item.data.id,
            status: item.data.status,
          }
        })
        this.approvers = {
          ...this.approvers,
          loading: false,
          pageInfo: data?.data?.usersPaginated?.pageInfo,
          items: this.approvers.items?.concat(mappedItems),
          totalCount: data?.data?.usersPaginated?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  requestPasswordPoliciesData(currentPage: number) {
    this.passwordPolicies = {
      ...this.passwordPolicies,
      currentPage,
      loading: true,
    }        
    this.passwordPolicies$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrder, SystemTables.PASSWORD_POLICIES)
      .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.passwordPolicies.items?.concat(data?.data?.hardcodedValues?.items);        
        this.passwordPolicies = {
        ...this.passwordPolicies,
        loading: false,
        pageInfo: data?.data?.hardcodedValues?.pageInfo,
        items: accumulatedItems,
        totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }

  requestRolesData(currentPage: number) {
    this.roles = {
      ...this.roles,
      currentPage,
      loading: true,
    }        
    this.roles$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrder, SystemTables.USER_ROLES)
      .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.roles.items?.concat(data?.data?.hardcodedValues?.items);        
        this.roles = {
        ...this.roles,
        loading: false,
        pageInfo: data?.data?.hardcodedValues?.pageInfo,
        items: accumulatedItems,
        totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }
    

  requestUserData(userId: number): void { 
    let users = undefined;
    users = { userId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "userId": { "eq": ${userId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    // let getData: boolean = false;
    this.setViewLoading(true); 
    this.user$ = this._sharedService.getUserDataGql$({ 
      userId, 
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter, 
    }).pipe(
      map(([ userGqlData, userGqlTranslationsData ]) => {
        return this._catalogsService.mapOneUser({
          userGqlData,  
          userGqlTranslationsData,
        })
      }),
      tap((userData: UserDetail) => {
        if (!userData) {
          const message = $localize`El registro no existe...`;
          this._sharedService.showSnackMessage({
            message,
            duration: 2500,
            snackClass: 'snack-warn',
            icon: 'check',
          });
          this.setToolbarMode(toolbarMode.INITIAL_WITH_NO_DATA);
          this.setViewLoading(false);
          this.loaded = true;
          this._location.replaceState('/catalogs/users/create');
          return;
        }
          
        this.user =  userData;
        this.translationChanged = false;
        this.imageChanged = false;
        this.storedTranslations = JSON.parse(JSON.stringify(this.user.translations));
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.user.translations?.length > 0 ? $localize`Traducciones (${this.user.translations?.length})` : $localize`Traducciones`;
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.user.translations?.length > 0 ? 'accent' : '';   
        this.updateFormFromData();
        this.changeInactiveButton(this.user.status);
        const toolbarButton = this.elements.find(e => e.action === ButtonActions.TRANSLATIONS);
        if (toolbarButton) {
          toolbarButton.caption = userData.translations?.length > 0 ? $localize`Traducciones (${userData.translations?.length})` : $localize`Traducciones`;
          toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
          toolbarButton.class = userData.translations?.length > 0 ? 'accent' : '';
        }        
        this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);
        this.setViewLoading(false);
        this.loaded = true;
      }),
      catchError(err => {
        this.setViewLoading(false);
        return EMPTY;
      })      
    ); 
  }  

  onFileSelected(event: any) {
    const fd = new FormData();
    fd.append('image', event.target.files[0], event.target.files[0].name);
    const uploadUrl = `${environment.apiUploadUrl}`;
    const params = new HttpParams()
    .set('destFolder', `${environment.uploadFolders.catalogs}/users`)
    .set('processId', this.user.id)
    .set('process', originProcess.CATALOGS_PROVIDERS);
    this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
      if (res) {
        this.imageChanged = true;
        this.userForm.controls.mainImageName.setValue(res.fileName);
        this.user.mainImagePath = res.filePath;
        this.user.mainImageGuid = res.fileGuid;
        this.user.mainImage = environment.uploadFolders.completePathToFiles + '/' + res.filePath.replace(res.fileName, `${res.fileGuid}${res.fileExtension}`)                
        const message = $localize`El archivo ha sido subido satisfactoriamente<br>Guarde El Usuario para aplicar el cambio`;
        this._sharedService.showSnackMessage({
          message,
          duration: 5000,
          snackClass: 'snack-primary',
          icon: 'check',
        });
        this.setEditionButtonsState();      }      
    });
  }

  getMoreData(getMoreDataParams: GeneralCatalogParams) {
    if (getMoreDataParams.catalogName === SystemTables.USERS) {
      if (getMoreDataParams.initArray) {
        this.approvers.currentPage = 0;
        this.approvers.items = [];
      } else if (!this.approvers.pageInfo.hasNextPage) {
        return;
      } else {
        this.approvers.currentPage++;
      }
      this.requestApproversData(        
        this.approvers.currentPage,
        getMoreDataParams.textToSearch,  
      ); 
    }     
  }

  handleOptionSelected(getMoreDataParams: any){
    console.log('[handleOptionSelected]', getMoreDataParams)
  }

  handleInputKeydown(event: KeyboardEvent) {
    console.log('[handleInputKeydown]', event)
  }

  pageChange(event: any) {
    this.pageInfo = { 
      ...this.pageInfo, 
      currentPage: event?.pageIndex, 
    }; 
    //this.requestData(this.pageInfo.currentPage * this.pageInfo.pageSize, this.pageInfo.pageSize, this.order);
  }

  setToolbarMode(mode: toolbarMode) {
    if (this.elements.length === 0) return;
    if (mode === toolbarMode.EDITING_WITH_DATA) {      
      // if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = false;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = false;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
      this.elements.find(e => e.action === ButtonActions.RESET).disabled = false;
    } else if (mode === toolbarMode.EDITING_WITH_NO_DATA) {
      // if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = false;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = true;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
      this.elements.find(e => e.action === ButtonActions.RESET).disabled = true;
    } else if (mode === toolbarMode.INITIAL_WITH_DATA) {
      // if (this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = true;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = false;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = false;
      this.elements.find(e => e.action === ButtonActions.RESET).disabled = false;
    } else if (mode === toolbarMode.INITIAL_WITH_NO_DATA) {
      // if (this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = true;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = true;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
      this.elements.find(e => e.action === ButtonActions.RESET).disabled = true;
    }    
  }

  updateFormFromData(): void {    
    this.userForm.patchValue({
      name: this.user.name,
      email: this.user.email,      
      roles: this.user.roles,      
      passwordPolicy: this.user.passwordPolicy,      
      mainImageName: this.user.mainImageName,      
      approver: this.user.approver,
    });
  } 

  prepareRecordToSave(newRecord: boolean): any {
    this.userForm.markAllAsTouched();
    const fc = this.userForm.controls;
    return  {
      id: this.user.id,
      customerId: 1, // TODO: Get from profile
      status: newRecord ? RecordStatus.ACTIVE : this.user.status,
      ...(fc.name.dirty || fc.name.touched || newRecord) && { name: fc.name.value  },
      ...(fc.email.dirty || fc.email.touched || newRecord) && { email: fc.email.value },            
      ...(fc.approver.dirty || fc.approver.touched || newRecord) && { approverId: fc.approver.value ? fc.approver.value.id : null },      
      ...(fc.roles.dirty || fc.roles.touched || newRecord) && { roles: fc.roles.value },      
      ...(fc.passwordPolicy.dirty || fc.passwordPolicy.touched || newRecord) && { passwordPolicy: fc.passwordPolicy.value },      

      ...(this.imageChanged) && { 
        mainImageName: fc.mainImageName.value,
        mainImagePath: this.user.mainImagePath,
        mainImageGuid: this.user.mainImageGuid, },
    }
  }

  setEditionButtonsState() {
    if (!this.user.id || this.user.id === null || this.user.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
    }
  }
  
  removeImage() {
    this.imageChanged = true;
    this.userForm.controls.mainImageName.setValue('');
    this.user.mainImagePath = '';
    this.user.mainImageGuid = '';
    this.user.mainImage = '';     
    const message = $localize`Se ha quitado la imagen del Usuario<br>Guarde El Usuario para aplicar el cambio`;
    this._sharedService.showSnackMessage({
      message,
      duration: 5000,
      snackClass: 'snack-primary',
      icon: 'check',
    });
    this.setEditionButtonsState();    
  }

  initForm(): void {
    this.userForm.reset();
    // Default values

    this.storedTranslations = [];
    this.translationChanged = false;
    this.user = emptyUserItem;
    this.focusThisField = 'name';
    setTimeout(() => {
      this.catalogEdition.nativeElement.scrollIntoView({            
        behavior: 'smooth',
        block: 'start',
      });   
      this.focusThisField = '';
    }, 200);
  }

  initUniqueField(): void {
    this.user.id = null;
    this.user.createdBy = null;
    this.user.createdAt = null;
    this.user.updatedBy = null;
    this.user.updatedAt = null; 
    this.user.status = RecordStatus.ACTIVE; 
    this.user.translations.map((t) => {
      return {
        ...t,
        id: null,
      }
    });
  }

  changeInactiveButton(status: RecordStatus | string): void {
    const toolbarOption = this.elements.find(e => e.action === ButtonActions.INACTIVATE);
    if (toolbarOption) {
      toolbarOption.caption = status === RecordStatus.ACTIVE ? $localize`Inactivar` : $localize`Reactivar`;
      toolbarOption.tooltip = status === RecordStatus.ACTIVE ? $localize`Inactivar el registro...` : $localize`Reactivar el registro...`;
      toolbarOption.icon = status === RecordStatus.ACTIVE ? 'delete' : 'check';   
    }
  }

  getFieldDescription(fieldControlName: string): string {
    if (fieldControlName === 'name') {
      return $localize`Descripción o nombre del Usuario`
    } else if (fieldControlName === 'approver') {
      return $localize`Aprobador`;
    }    
    return '';
  }

  setViewLoading(loading: boolean): void {
    this.loading = loading;
    this._sharedService.setGeneralLoading(
      ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
      loading,
    ); 
  }

  validateTables(): void {
    if (this.userForm.controls.approver.value && this.userForm.controls.approver.value && this.userForm.controls.approver.value.status === RecordStatus.INACTIVE) {
      this.userForm.controls.approver.setErrors({ inactive: true });   
    } else {
      this.userForm.controls.approver.setErrors(null);   
    }
    // It is missing the validation for state and thresholdType because we dont retrieve the complete record but tghe value
  }

  processTranslations$(userId: number): Observable<any> { 
    if (!this.user.translations || this.storedTranslations) return of(null);
    const differences = this.storedTranslations?.length !== this.user.translations?.length || this.storedTranslations?.some((st: any) => {
      return this.user.translations.find((t: any) => {        
        return st.languageId === t.languageId &&
        st.id === t.id &&
        (st.name !== t.name || 
        st.reference !== t.reference || 
        st.notes !== t.notes);
      });
    });
    if (differences) {
      const translationsToDelete = this.storedTranslations.map((t: any) => {
        return {
          id: t.id,
          deletePhysically: true,
        }
      });
      const varToDelete = {
        ids: translationsToDelete,
        customerId: 1, // TODO: Get from profile
        recipientId: 1, // TODO: Get from profile
        approverId: 1, // TODO: Get from profile
        plantId: 1, // TODO: Get from profile
      }      
      const translationsToAdd = this.user.translations.map((t: any) => {
        return {
          id: null,
          userId,
          name: t.name,
          reference: t.reference,
          notes: t.notes,
          languageId: t.languageId,
          status: RecordStatus.ACTIVE,
        }
      });
      const varToAdd = {
        translations: translationsToAdd,
      }
  
      return combineLatest([ 
        varToAdd.translations?.length > 0 ? this._catalogsService.addUserTranslations$(varToAdd) : of(null),
        varToDelete.ids.length > 0 ? this._catalogsService.deleteUserTranslations$(varToDelete) : of(null) 
      ]);
    } else {
      return of(null);
    }
    
  }

  duplicateMainImage() {    
    this.duplicateMainImage$ = this._catalogsService.duplicateMainImage$(originProcess.CATALOGS_WORKGROUPS, this.user.mainImageGuid)
    .pipe(
      tap((newAttachments) => {
        if (newAttachments.duplicated) {       
          this.imageChanged = true;   
          this.user.mainImageGuid = newAttachments.mainImageGuid;
          this.user.mainImageName = newAttachments.mainImageName;
          this.user.mainImagePath = newAttachments.mainImagePath;   

          this.user.mainImage = `${environment.uploadFolders.completePathToFiles}/${this.user.mainImagePath}`;
          this.userForm.controls.mainImageName.setValue(this.user.mainImageName);
        }        
      })
    );
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

  get RecordStatus() {
    return RecordStatus; 
  }

// End ======================
}
