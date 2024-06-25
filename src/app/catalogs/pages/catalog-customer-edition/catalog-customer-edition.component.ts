import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {  routingAnimation,  dissolve,} from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, GoTopButtonStatus, PageInfo, ProfileData, RecordStatus, SettingsData, ToolbarButtonClicked, ToolbarElement, dialogByDefaultButton, SystemTables, toolbarMode, ScreenDefaultValues, GeneralValues, originProcess, } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AppState, selectSettingsData } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import {  EMPTY,  Observable,  Subscription,  catchError,  combineLatest,  map,  of,  skip,  tap,} from 'rxjs';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import {  FormGroup,  FormControl,  Validators,  NgForm,  AbstractControl,} from '@angular/forms';
import { CatalogsService } from '../../services';
import {  CustomerDetail,  CustomerItem,  emptyGeneralHardcodedValuesItem,  emptyCustomerItem,} from '../../models';
import { HttpClient, HttpParams } from '@angular/common/http';
import {  GenericDialogComponent,  TranslationsDialogComponent,} from 'src/app/shared/components';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-catalog-customer-edition',
  templateUrl: './catalog-customer-edition.component.html',
  animations: [routingAnimation, dissolve],
  styleUrls: ['./catalog-customer-edition.component.scss'],
})
export class CatalogCustomerEditionComponent {
  @ViewChild('catalogEdition') private catalogEdition: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('f') private thisForm: NgForm;

  // Customers ===============
  customer: CustomerDetail = emptyCustomerItem;
  scroll$: Observable<any>;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>;
  toolbarClick$: Observable<ToolbarButtonClicked>;
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  
  customer$: Observable<CustomerDetail>;
  translations$: Observable<any>;
  updateCustomer$: Observable<any>;
  updateCustomerCatalog$: Observable<any>;
  deleteCustomerTranslations$: Observable<any>;
  addCustomerTranslations$: Observable<any>;
  customerFormChangesSubscription: Subscription;
  uploadFiles: Subscription;
  catalogIcon: string = 'our_costumers';
  today = new Date();
  order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);
  harcodedValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);
  storedTranslations: [];
  translationChanged: boolean = false;
  imageChanged: boolean = false;
  submitControlled: boolean = false;
  loading: boolean;
  elements: ToolbarElement[] = [];
  panelOpenState: boolean[] = [true, false, false];
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  customerData: CustomerItem;
  goTopButtonTimer: any;
  takeRecords: number;
  focusThisField: string = '';

  customerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    notes: new FormControl(''),
    reference: new FormControl(''),
    prefix: new FormControl(''),
    mainImageName: new FormControl(''),    
  });

  pageInfo: PageInfo = {
    currentPage: 0,
    totalRecords: 0,
    totalPages: 0,
    inactiveRecords: 0,
    activeRecords: 0,
  };

  // Temporal
  tmpDate: number = 112;
  loaded: boolean = false;

  constructor(
    private _store: Store<AppState>,
    public _sharedService: SharedService,
    private _catalogsService: CatalogsService,
    private _router: Router,
    private _http: HttpClient,
    public _scrollDispatcher: ScrollDispatcher,
    private _route: ActivatedRoute,
    public _dialog: MatDialog,
    private _location: Location
  ) {}

  // Hooks ====================
  ngOnInit() {
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.CUSTOMERS_CATALOG_EDITION,
      true
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
    this.scroll$ = this._scrollDispatcher.scrolled().pipe(
      tap((data: any) => {
        this.getScrolling(data);
      })
    );
    this.settingsData$ = this._store.select(selectSettingsData).pipe(
      tap((settingsData) => {
        this.settingsData = settingsData;
        this.takeRecords = this.settingsData.catalog?.pageSize || 50;
      })
    );

    this.customerFormChangesSubscription =
      this.customerForm.valueChanges.subscribe((customerFormChanges: any) => {
        if (!this.loaded) return;
        this.setEditionButtonsState();
      });
    this.toolbarAnimationFinished$ =
      this._sharedService.toolbarAnimationFinished.pipe(
        tap((animationFinished: boolean) => {
          this._sharedService.setGeneralProgressBar(
            ApplicationModules.CUSTOMERS_CATALOG_EDITION,
            !animationFinished
          );
        })
      );
    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      skip(1),
      tap((buttonClicked: ToolbarButtonClicked) => {
        if (
          buttonClicked.from !== ApplicationModules.CUSTOMERS_CATALOG_EDITION
        ) {
          return;
        }
        this.toolbarAction(buttonClicked);
      })
    );
    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.requestCustomerData(+params['id']);
        }
      })
    );
    this.calcElements();

    setTimeout(() => {
      this.focusThisField = 'name';
      this.loaded = true;
    }, 200);
  }

  ngOnDestroy(): void {
    this._sharedService.setToolbar({
      from: ApplicationModules.CUSTOMERS_CATALOG,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.CUSTOMERS_CATALOG,
      false
    );
    if (this.uploadFiles) this.uploadFiles.unsubscribe();
    if (this.customerFormChangesSubscription)
      this.customerFormChangesSubscription.unsubscribe();
  }

  // Functions ================

  pageAnimationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this._sharedService.setToolbar({
          from: ApplicationModules.CUSTOMERS_CATALOG_EDITION,
          show: true,
          showSpinner: false,
          toolbarClass: 'toolbar-grid',
          dividerClass: 'divider',
          elements: this.elements,
          alignment: 'right',
        });
      }, 500);
    }
  }

  toolbarAction(action: ToolbarButtonClicked) {
    if (
      action.from === ApplicationModules.CUSTOMERS_CATALOG_EDITION &&
      this.elements.length > 0
    ) {
      if (action.action === ButtonActions.NEW) {
        this.elements.find((e) => e.action === action.action).loading = true;
        if (
          !this.elements.find((e) => e.action === ButtonActions.SAVE).disabled
        ) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus: true,
            data: {
              title: $localize`Cambios sin guardar`,
              topIcon: 'warn-fill',
              defaultButtons: dialogByDefaultButton.ACCEPT,
              buttons: [],
              body: {
                message: $localize`Existen cambios sin guardar, primero <strong>cancele la edición actual</strong> y luego reinicie el formulario.`,
              },
              showCloseButton: true,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            this.elements.find((e) => e.action === action.action).loading =
              false;
          });
        } else {
          this._location.replaceState('/catalogs/customers/create');
          this.initForm();
          this.elements.find((e) => e.action === action.action).loading = false;
        }
      } else if (action.action === ButtonActions.BACK) {
        this.elements.find((e) => e.action === action.action).loading = true;
        setTimeout(() => {
          this.elements.find((e) => e.action === action.action).loading = false;
          this._router.navigateByUrl('/catalogs/customers');
        }, 750);
      } else if (action.action === ButtonActions.COPY) {
        this.elements.find((e) => e.action === action.action).loading = true;
        this.initUniqueField();
        this._location.replaceState('/catalogs/customers/create');
        this.focusThisField = 'name';
        setTimeout(() => {
          this.focusThisField = '';
        }, 100);
        setTimeout(() => {
          this.elements.find((e) => e.action === action.action).loading = false;          
          this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
        }, 750);
      } else if (action.action === ButtonActions.SAVE) {
        this.elements.find((e) => e.action === action.action).loading = true;
        this.submitControlled = true;
        this.thisForm.ngSubmit.emit();
        setTimeout(() => {
          this.elements.find((e) => e.action === action.action).loading = false;
        }, 200);
      } else if (action.action === ButtonActions.CANCEL) {
        this.elements.find((e) => e.action === action.action).loading = true;
        let noData = true;
        if (
          !this.customer.id ||
          this.customer.id === null ||
          this.customer.id === 0
        ) {
          this.initForm();
        } else {
          noData = false;
          this.requestCustomerData(this.customer.id);
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
          this.elements.find((e) => e.action === action.action).loading = false;
        }, 200);
      } else if (action.action === ButtonActions.INACTIVATE) {
        this.elements.find((e) => e.action === action.action).loading = true;
        if (
          this.customer?.id > 0 &&
          this.customer.status === RecordStatus.ACTIVE
        ) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus: true,
            data: {
              title: $localize`INACTIVAR CLIENTE`,
              topIcon: 'delete',
              buttons: [
                {
                  action: 'inactivate',
                  showIcon: true,
                  icon: 'delete',
                  showCaption: true,
                  caption: $localize`Inactivar`,
                  showTooltip: true,
                  class: 'warn',
                  tooltip: $localize`Inactiva el registro`,
                  default: true,
                },
                {
                  action: 'cancel',
                  showIcon: true,
                  icon: 'cancel',
                  showCaption: true,
                  caption: $localize`Cancelar`,
                  showTooltip: true,
                  tooltip: $localize`Cancela la acción`,
                  default: false,
                },
              ],
              body: {
                message: $localize`Esta acción inactivará al cliente con el Id <strong>${this.customer.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: true,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            if (response.action === 'cancel') {
              setTimeout(() => {
                this._sharedService.actionCancelledByTheUser();
                this.elements.find((e) => e.action === action.action).loading =
                  false;
              }, 200);
            } else {            
              this.elements.find((e) => e.action === action.action).loading =
                true;
              const customerParameters = {
                settingType: 'statusCustomer',
                id: this.customer.id,

                status: RecordStatus.INACTIVE,
              };
              const customers =
                this._sharedService.setGraphqlGen(customerParameters);
              
              this.updateCustomer$ = this._catalogsService
                .updateCustomerStatus$(customers)
                .pipe(
                  tap((data: any) => {
                    if (
                      data?.data?.createOrUpdateCustomer.length > 0 &&
                      data?.data?.createOrUpdateCustomer[0].status ===
                        RecordStatus.INACTIVE
                    ) {
                      setTimeout(() => {
                        this.changeInactiveButton(RecordStatus.INACTIVE);
                        const message = $localize`El cliente ha sido inhabilitado`;
                        this.customer.status = RecordStatus.INACTIVE;
                        this._sharedService.showSnackMessage({
                          message,
                          snackClass: 'snack-warn',
                          progressBarColor: 'warn',
                          icon: 'delete',
                        });
                        this.elements.find(
                          (e) => e.action === action.action
                        ).loading = false;
                      }, 200);
                    }
                  })
                );
            }
          });
        } else if (
          this.customer?.id > 0 &&
          this.customer.status === RecordStatus.INACTIVE
        ) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            autoFocus: true,
            data: {
              title: $localize`REACTIVAR CLIENTE`,
              topIcon: 'check',
              buttons: [
                {
                  action: 'reactivate',
                  showIcon: true,
                  icon: 'check',
                  showCaption: true,
                  caption: $localize`Reactivar`,
                  showTooltip: true,
                  class: 'primary',
                  tooltip: $localize`Reactiva el registro`,
                  default: true,
                },
                {
                  action: 'cancel',
                  showIcon: true,
                  icon: 'cancel',
                  showCaption: true,
                  caption: $localize`Cancelar`,
                  showTooltip: true,
                  tooltip: $localize`Cancela la acción`,
                  default: false,
                },
              ],
              body: {
                message: $localize`Esta acción reactivará al cliente con el Id <strong>${this.customer.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: true,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            if (response.action === 'cancel') {
              setTimeout(() => {
                this._sharedService.actionCancelledByTheUser();
                this.elements.find((e) => e.action === action.action).loading =
                  false;
              }, 200);
            } else {
              console.log("molds?")
              this.elements.find((e) => e.action === action.action).loading =
                true;
              const customerParameters = {
                settingType: 'statusCustomer',
                id: this.customer.id,

                status: RecordStatus.ACTIVE,
              };
              const customers =
                this._sharedService.setGraphqlGen(customerParameters);
              this.updateCustomer$ = this._catalogsService
                .updateCustomerStatus$(customers)
                .pipe(
                  tap((data: any) => {
                    if (
                      data?.data?.createOrUpdateCustomer.length > 0 &&
                      data?.data?.createOrUpdateCustomer[0].status ===
                        RecordStatus.ACTIVE
                    ) {
                      setTimeout(() => {
                        this.changeInactiveButton(RecordStatus.ACTIVE);
                        this.customer.status = RecordStatus.ACTIVE;
                        const message = $localize`El cliente ha sido reactivado`;
                        this._sharedService.showSnackMessage({
                          message,
                          snackClass: 'snack-primary',
                          progressBarColor: 'primary',
                          icon: 'check',
                        });
                        this.elements.find(
                          (e) => e.action === action.action
                        ).loading = false;
                      }, 200);
                    }
                  })
                );
            }
          });
        }
      } else if (action.action === ButtonActions.TRANSLATIONS) {
        if (this.customer?.id > 0) {
          const dialogResponse = this._dialog.open(
            TranslationsDialogComponent,
            {
              width: '500px',
              disableClose: true,
              data: {
                duration: 0,
                translationsUpdated: false,
                title: $localize`Traducciones del cliente <strong>${this.customer.id}</strong>`,
                topIcon: 'world',
                translations: this.customer.translations,
                buttons: [
                  {
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
                  },
                  {
                    action: ButtonActions.CANCEL,
                    showIcon: true,
                    icon: 'cancel',
                    showCaption: true,
                    caption: $localize`Cancelar`,
                    showTooltip: true,
                    tooltip: $localize`Cancela la edición actual`,
                    disabled: true,
                  },
                  {
                    action: ButtonActions.DELETE,
                    showIcon: true,
                    icon: 'garbage-can',
                    showCaption: true,
                    caption: $localize`Eliminar`,
                    showTooltip: true,
                    class: 'warn',
                    tooltip: $localize`Elimina la traducción`,
                    disabled: true,
                  },
                  {
                    action: ButtonActions.CLOSE,
                    showIcon: true,
                    icon: 'cross',
                    showCaption: true,
                    caption: $localize`Cerrar`,
                    showTooltip: true,
                    tooltip: $localize`Cierra ésta ventana`,
                    cancel: true,
                  },
                ],
                body: {
                  message: $localize`Esta acción inactivará al cliente ${this.customer.id} y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
                },
                showCloseButton: false,
              },
            }
          );
          dialogResponse.afterClosed().subscribe((response) => {
            this.translationChanged = response.translationsUpdated;
            if (response.translationsUpdated) {
              //this._store.dispatch(updateMoldTranslations({
              this.customer.translations = [...response.translations];
              //}));
              this.elements.find(
                (e) => e.action === ButtonActions.TRANSLATIONS
              ).caption =
                this.customer.translations.length > 0
                  ? $localize`Traducciones (${this.customer.translations.length})`
                  : $localize`Traducciones`;
              this.elements.find(
                (e) => e.action === ButtonActions.TRANSLATIONS
              ).class = this.customer.translations.length > 0 ? 'accent' : '';
              this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
            }
          });
        }
      }
    }
  }

  calcElements() {
    this.elements = [
      {
        type: 'button',
        caption: $localize`Regresar...`,
        tooltip: $localize`Regresar a la lista de customers`,
        icon: 'arrow-left',
        class: 'primary',
        iconSize: '24px',
        showIcon: true,
        showTooltip: true,
        alignment: 'left',
        showCaption: true,
        loading: false,
        disabled: false,
        action: ButtonActions.BACK,
      },
      {
        type: 'button',
        caption: $localize`Inicializar`,
        tooltip: $localize`Inicializa la pantalla actual`,
        icon: 'document',
        class: '',
        iconSize: '24px',
        showIcon: true,
        showTooltip: true,
        showCaption: true,
        loading: false,
        disabled: false,
        action: ButtonActions.NEW,
      },
      {
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
        disabled: true,
        action: undefined,
      },
      {
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
        disabled: true,
        elementType: 'submit',
        action: ButtonActions.SAVE,
      },
      {
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
        disabled: true,
        action: ButtonActions.CANCEL,
      },
      {
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
        disabled: true,
        action: undefined,
      },
      {
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
        disabled: true,
        action: ButtonActions.COPY,
      },
      {
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
        disabled: this.customer?.status !== RecordStatus.ACTIVE,
        action: ButtonActions.INACTIVATE,
      },
      {
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
        disabled: true,
        action: undefined,
      },
      {
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
        disabled: !!!this.customer.id,
        action: ButtonActions.TRANSLATIONS,
      },
    ];
  }

  getScrolling(data: CdkScrollable) {
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;
    let status = 'inactive';
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
            'inactive'
          );
        }
        return;
      }, 2500);
    }
    if (this.onTopStatus !== status) {
      this.onTopStatus = status;
      this._sharedService.setGoTopButton(ApplicationModules.GENERAL, status);
    }
  }

  onSubmit() {
    if (!this.submitControlled) return;
    this.submitControlled = false;

    this.customerForm.markAllAsTouched();
    this.customerForm.updateValueAndValidity();
    if (this.customerForm.valid) {
      this.saveRecord();
    } else {
      let fieldsMissing = '';
      let fieldsMissingCounter = 0;
      for (const controlName in this.customerForm.controls) {
        if (this.customerForm.controls.hasOwnProperty(controlName)) {
          const typedControl: AbstractControl =
            this.customerForm.controls[controlName];
          if (typedControl.invalid) {
            fieldsMissingCounter++;
            fieldsMissing += `<strong>${fieldsMissingCounter}.</strong> ${this.getFieldDescription(
              controlName
            )}<br>`;
          }
        }
      }
      const dialogResponse = this._dialog.open(GenericDialogComponent, {
        width: '450px',
        disableClose: true,
        panelClass: 'warn-dialog',
        autoFocus: true,
        data: {
          title: $localize`DATOS INVÁLIDOS`,
          topIcon: 'warn-fill',
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
        for (const controlName in this.customerForm.controls) {
          if (this.customerForm.controls.hasOwnProperty(controlName)) {
            const typedControl: AbstractControl =
              this.customerForm.controls[controlName];
            if (typedControl.invalid) {
              if (!fieldFocused) {
                this.focusThisField = controlName;
                setTimeout(() => {
                  this.focusThisField = '';
                }, 100);
                break;
              }
              fieldsMissingCounter++;
              fieldsMissing += `<strong>${fieldsMissingCounter}.</strong> ${this.getFieldDescription(
                controlName
              )}<br>`;
            }
          }
        }
        setTimeout(() => {
          this.elements.find((e) => e.action === ButtonActions.SAVE).loading =
            false;
        }, 100);
      });
    }
  }

  saveRecord() {
    this.setViewLoading(true);
    const newRecord =
      !this.customer.id || this.customer.id === null || this.customer.id === 0;
    const dataToSave = this.prepareRecordToAdd(newRecord);
    this.updateCustomerCatalog$ = this._catalogsService.updateCustomerCatalog$(dataToSave)
    .pipe(
      tap((data: any) => {
        if (data?.data?.createOrUpdateCustomer.length > 0) {
          const customerId = data?.data?.createOrUpdateCustomer[0].id;        
          this.processTranslations$(customerId).subscribe(() => {
            this.requestCustomerData(customerId);
            setTimeout(() => {
              let message = $localize`El cliente ha sido actualizado`;
              if (newRecord) {
                message = $localize`El cliente ha sido creado satisfactoriamente con el id <strong>${customerId}</strong>`;
                this._location.replaceState(
                  `/catalogs/customers/edit/${customerId}`
                );
              }
              this._sharedService.showSnackMessage({
                message,
                snackClass: 'snack-accent',
                progressBarColor: 'accent',
              });
              this.setViewLoading(false);
              this.elements.find(
                (e) => e.action === ButtonActions.SAVE
              ).loading = false;
            }, 200);
          });
        }
      })
    )
  }

  requestCustomerData(customerId: number): void {
    let customers = undefined;
    customers = { customerId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "customerId": { "eq": ${customerId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    // let getData: boolean = false;
    this.setViewLoading(true);
   
    this.customer$ = this._catalogsService
      .getCustomerDataGql$({
        customerId,
        skipRecords,
        takeRecords: this.takeRecords,
        order,
        filter,
      })
      .pipe(
        map(([customerGqlData, customerGqlTranslationsData]) => {
          return this._catalogsService.mapOneCustomer({
            customerGqlData,
            customerGqlTranslationsData,
          });
        }),
        tap((customerData: CustomerDetail) => {
          if (!customerData) return;
          this.customer = customerData;
          this.translationChanged = false;
          this.imageChanged = false;
          this.storedTranslations = JSON.parse(
            JSON.stringify(this.customer.translations)
          );
          this.elements.find(
            (e) => e.action === ButtonActions.TRANSLATIONS
          ).caption =
            this.customer.translations.length > 0
              ? $localize`Traducciones (${this.customer.translations.length})`
              : $localize`Traducciones`;
          this.elements.find(
            (e) => e.action === ButtonActions.TRANSLATIONS
          ).class = this.customer.translations.length > 0 ? 'accent' : '';
          this.updateFormFromData();
          this.changeInactiveButton(this.customer.status);
          const toolbarButton = this.elements.find(
            (e) => e.action === ButtonActions.TRANSLATIONS
          );
          if (toolbarButton) {
            toolbarButton.caption =
              customerData.translations.length > 0
                ? $localize`Traducciones (${customerData.translations.length})`
                : $localize`Traducciones`;
            toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
            toolbarButton.class =
              customerData.translations.length > 0 ? 'accent' : '';
          }
          this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);
          this.setViewLoading(false);
          this.loaded = true;
        }),
        catchError((err) => {
          this.setViewLoading(false);
          return EMPTY;
        })
      );
  }

  requestGenericsData$(
    currentPage: number,
    skipRecords: number,
    catalog: string,
    filterStr: string = null
  ): Observable<any> {
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(
        `{ "and": [ { "data": { "tableName": { "eq": "${catalog}" } } }, { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`
      );
    } else {
      filter = JSON.parse(
        `{ "and":  [ { "data": { "tableName": { "eq": "${catalog}" } } } , { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } } ] } `
      );
    }
    const customerParameters = {
      settingType: 'tables',
      skipRecords,
      takeRecords: this.takeRecords,
      filter,
      order: this.order,
    };
    const customers =
      this._sharedService.setGraphqlGen(customerParameters);
    return this._catalogsService
      .getGenericsLazyLoadingDataGql$(customers)
      .pipe();
  }

  onFileSelected(event: any) {
    const fd = new FormData();
    fd.append('image', event.target.files[0], event.target.files[0].name);

    const uploadUrl = `${environment.apiUploadUrl}`;
    const params = new HttpParams()
    .set('destFolder', `${environment.uploadFolders.catalogs}/customers`)
    .set('processId', this.customer.id)
    .set('process', originProcess.CATALOGS_CUSTOMERS);
    this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
      if (res) {
        this.imageChanged = true;
        this.customerForm.controls.mainImageName.setValue(res.fileName);
        this.customer.mainImagePath = res.filePath;
        this.customer.mainImageGuid = res.fileGuid;
        this.customer.mainImage = environment.serverUrl + '/' + res.filePath.replace(res.fileName, `${res.fileGuid}${res.fileExtension}`)                
        const message = $localize`El archivo ha sido subido satisfactoriamente<br>Guarde el cliente para aplicar el cambio`;
        this._sharedService.showSnackMessage({
          message,
          duration: 5000,
          snackClass: 'snack-primary',
          icon: 'check',
        });
        this.setEditionButtonsState();
      }      
    });
  }

  setEditionButtonsState() {
    if (!this.customer.id || this.customer.id === null || this.customer.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
    }
  }

  removeImage() {
    this.imageChanged = true;
    this.customerForm.controls.mainImageName.setValue('');
    this.customer.mainImagePath = '';
    this.customer.mainImageGuid = '';
    this.customer.mainImage = '';     
    const message = $localize`Se ha quitado la imagen del cliente<br>Guarde el cliente para aplicar el cambio`;
    this._sharedService.showSnackMessage({
      message,
      duration: 5000,
      snackClass: 'snack-primary',
      icon: 'check',
    });
    this.setEditionButtonsState();
  }


  handleInputKeydown(event: KeyboardEvent) {
    console.log('[handleInputKeydown]', event);
  }

  handleMultipleSelectionChanged(catalog: string) {
    this.setEditionButtonsState();
  }

  pageChange(event: any) {
    this.pageInfo = {
      ...this.pageInfo,
      currentPage: event?.pageIndex,
    };
  }

  setToolbarMode(mode: toolbarMode) {
    if (this.elements.length === 0) return;
    if (mode === toolbarMode.EDITING_WITH_DATA) {
      // if (!this.elements.find((e) => e.action === ButtonActions.SAVE).disabled) return;
      this.elements.find((e) => e.action === ButtonActions.SAVE).disabled =
        false;
      this.elements.find((e) => e.action === ButtonActions.CANCEL).disabled =
        false;
      this.elements.find(
        (e) => e.action === ButtonActions.TRANSLATIONS
      ).disabled = false;
      this.elements.find(
        (e) => e.action === ButtonActions.INACTIVATE
      ).disabled = false;
      this.elements.find((e) => e.action === ButtonActions.COPY).disabled =
        true;
    } else if (mode === toolbarMode.EDITING_WITH_NO_DATA) {
      // if (!this.elements.find((e) => e.action === ButtonActions.SAVE).disabled) return;
      this.elements.find((e) => e.action === ButtonActions.SAVE).disabled =
        false;
      this.elements.find((e) => e.action === ButtonActions.CANCEL).disabled =
        false;
      this.elements.find(
        (e) => e.action === ButtonActions.TRANSLATIONS
      ).disabled = true;
      this.elements.find(
        (e) => e.action === ButtonActions.INACTIVATE
      ).disabled = true;
      this.elements.find((e) => e.action === ButtonActions.COPY).disabled =
        true;
    } else if (mode === toolbarMode.INITIAL_WITH_DATA) {
      this.elements.find((e) => e.action === ButtonActions.SAVE).disabled =
        true;
      this.elements.find((e) => e.action === ButtonActions.CANCEL).disabled =
        true;
      this.elements.find(
        (e) => e.action === ButtonActions.TRANSLATIONS
      ).disabled = false;
      this.elements.find(
        (e) => e.action === ButtonActions.INACTIVATE
      ).disabled = false;
      this.elements.find((e) => e.action === ButtonActions.COPY).disabled =
        false;
    } else if (mode === toolbarMode.INITIAL_WITH_NO_DATA) {
      // if (this.elements.find((e) => e.action === ButtonActions.SAVE).disabled) return;
      this.elements.find((e) => e.action === ButtonActions.SAVE).disabled =
        true;
      this.elements.find((e) => e.action === ButtonActions.CANCEL).disabled =
        true;
      this.elements.find(
        (e) => e.action === ButtonActions.TRANSLATIONS
      ).disabled = true;
      this.elements.find(
        (e) => e.action === ButtonActions.INACTIVATE
      ).disabled = true;
      this.elements.find((e) => e.action === ButtonActions.COPY).disabled =
        true;
    }
  }

  updateFormFromData(): void {
    this.customerForm.patchValue({
      name: this.customer.name,
      mainImageName: this.customer.mainImageName,
      reference: this.customer.reference,
      prefix: this.customer.prefix,
      notes: this.customer.notes,
    });
  }

  prepareRecordToAdd(newRecord: boolean): any {
    const fc = this.customerForm.controls;
    return {
      id: this.customer.id,

      status: newRecord ? RecordStatus.ACTIVE : this.customer.status,
      ...((fc.name.dirty || fc.name.touched || newRecord) && {
        name: fc.name.value,
      }),
      ...((fc.reference.dirty || fc.reference.touched || newRecord) && {
        reference: fc.reference.value,
      }),
      ...((fc.notes.dirty || fc.notes.touched || newRecord) && {
        notes: fc.notes.value,
      }),
      ...((fc.prefix.dirty || fc.prefix.touched || newRecord) && {
        prefix: fc.prefix.value,
      }),
      ...(this.imageChanged) && { 
        mainImageName: fc.mainImageName.value,
        mainImagePath: this.customer.mainImagePath,
        mainImageGuid: this.customer.mainImageGuid, },
    };
  }

  initForm(): void {
    this.customerForm.reset();
    // Default values
    
    this.storedTranslations = [];
    this.translationChanged = false;
    this.customer = emptyCustomerItem;
    this.focusThisField = 'description';
    setTimeout(() => {
      this.catalogEdition.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      this.focusThisField = '';
    }, 200);
  }

  initUniqueField(): void {
    this.customer.id = null;
    this.customer.createdBy = null;
    this.customer.createdAt = null;
    this.customer.updatedBy = null;
    this.customer.updatedAt = null;
    this.customer.status = RecordStatus.ACTIVE;
    this.customer.translations.map((t) => {
      return {
        ...t,
        id: null,
      };
    });
  }

  changeInactiveButton(status: RecordStatus | string): void {
    const toolbarOption = this.elements.find(
      (e) => e.action === ButtonActions.INACTIVATE
    );
    if (toolbarOption) {
      toolbarOption.caption =
        status === RecordStatus.ACTIVE
          ? $localize`Inactivar`
          : $localize`Reactivar`;
      toolbarOption.tooltip =
        status === RecordStatus.ACTIVE
          ? $localize`Inactivar el registro...`
          : $localize`Reactivar el registro...`;
      toolbarOption.icon = status === RecordStatus.ACTIVE ? 'delete' : 'check';
    }
  }

  getFieldDescription(fieldControlName: string): string {
    if (fieldControlName === 'name') {
      return $localize`Descripción o nombre del cliente`;
    }
    return '';
  }

  setViewLoading(loading: boolean): void {
    this.loading = loading;
    this._sharedService.setGeneralLoading(
      ApplicationModules.CUSTOMERS_CATALOG_EDITION,
      loading
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.CUSTOMERS_CATALOG_EDITION,
      loading
    );
  }

  validateTablesx(): void {
    // It is missing the validation for state and thresholdType because we dont retrieve the complete record but tghe value
  }

  processTranslations$(customerId: number): Observable<any> {
    const differences =
      this.storedTranslations.length !== this.customer.translations.length ||
      this.storedTranslations.some((st: any) => {
        return this.customer.translations.find((t: any) => {
          return (
            st.languageId === t.languageId &&
            st.id === t.id &&
            (st.name !== t.name ||
              st.reference !== t.reference ||
              st.notes !== t.notes)
          );
        });
      });
    if (differences) {
      const translationsToDelete = this.storedTranslations.map((t: any) => {
        return {
          id: t.id,
          deletePhysically: true,
        };
      });
      const varToDelete = {
        ids: translationsToDelete,
        customerId: 1, // TODO: Get from profile
      };
      const translationsToAdd = this.customer.translations.map((t: any) => {
        return {
          id: null,
          customerId,
          name: t.name,          
          reference: t.reference,
          notes: t.notes,
          languageId: t.languageId,
          status: RecordStatus.ACTIVE,
        };
      });
      const varToAdd = {
        translations: translationsToAdd,
      };

      return combineLatest([
        varToAdd.translations.length > 0
          ? this._catalogsService.addCustomerTransations$(varToAdd)
          : of(null),
        varToDelete.ids.length > 0
          ? this._catalogsService.deleteCustomerTranslations$(varToDelete)
          : of(null),
      ]);
    } else {
      return of(null);
    }
  }

  get SystemTables() {
    return SystemTables;
  }

  get ScreenDefaultValues() {
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
