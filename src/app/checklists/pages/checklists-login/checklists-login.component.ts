import { Component, ViewChild } from '@angular/core';
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { catchError, EMPTY, filter, map, mergeMap, Observable, tap } from 'rxjs';
import { SharedService } from 'src/app/shared/services';
import { GeneralValues, UserDetail } from 'src/app/shared/models';
import { ChecklistsService } from '../../services';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Location } from '@angular/common';
import { CatalogsService } from 'src/app/catalogs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-catalog-checklist-plans',
  templateUrl: './checklists-login.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./checklists-login.component.scss']
})
export class ChecklistsLoginComponent {
  @ViewChild('f') private thisForm: NgForm;
  submitControlled: boolean = false;
  loading: boolean = false;
  login$: Observable<any>;
  user$: Observable<any>;
  action: string = "login";
  passwordPolicy: string = "none";

  loginForm = new FormGroup({
    userName: new FormControl(
      '', 
      Validators.required,      
    ),
    userPass: new FormControl(''),
    currentPassword: new FormControl(''),
    newPassword: new FormControl(''),
    confirmation: new FormControl(''),
  })

  constructor(
    public _sharedService: SharedService,
    public _checklistsService: ChecklistsService,
    public _catalogsService: CatalogsService,    
    private _router: Router,    
  ) { }

  ngOnInit(): void {    
    if (this._sharedService.isChangingPassword()) {
      this.action = 'changePassword';
      this._sharedService.setChangingPassword(false);
    }
  }

  onSubmit() {
    this.loading = true;
    if (this.action === 'login') {
      const payload = {
        email: this.loginForm.controls.userName.value,
        password: this.loginForm.controls.userPass.value
      }
      
      this.login$ = this._checklistsService.login$(payload)
      .pipe(
        tap((user: any) => {
          if (user) {
            if (user.initialize  && user.initialize === GeneralValues.YES) {
              this.passwordPolicy = user.policy ?? 'hard';
              this.action = 'change';
              const message = $localize`Proceda a cambiar su contrasdeña<br>`;
              this._sharedService.showSnackMessage({
                message,
                duration: 4000,
                snackClass: 'snack-primary',
                icon: 'check',
              });
              this.loading = false;
            } else if (user.token) {
              localStorage.setItem('authorization', user.token);
              const decoded = jwtDecode<JwtPayload>(user.token);

              this.user$ = this._sharedService.getUserDataGql$({ userId: Number(decoded['Id']) })
              .pipe(
                tap((profileData) => {
                  const profile = this._catalogsService.mapOneUser({
                    userGqlData: profileData.length > 0 ? profileData[0] : null,  
                    userGqlTranslationsData: profileData.length > 1 ? profileData[1] : null,  
                  });      
                  this._sharedService.setProfileData(profile);                  
                  this._router.navigateByUrl('/checklists/list'); 
                  this.loading = false;
                }),
                catchError(() => {
                  this.loading = false;
                  return EMPTY
                })
              )
            } else if (user.message) {
              this.action = 'login';
              const message = $localize`La contraseña fue cambiada correctamente, proceda a iniciar su sesión<br>`;
              this._sharedService.showSnackMessage({
                message,
                duration: 4000,
                snackClass: 'snack-primary',
                icon: 'check',
              });
              this.loading = false;                  
            }
          }
        }),
        catchError((err) => {
          this.loading = false;                  
          const message = $localize`Se generó un error en el inicio de sesión ${err?.error?.message}<br>`;
          this._sharedService.showSnackMessage({
            message,
            duration: 4000,
            snackClass: 'snack-warn',
            icon: 'check',
          });
          return EMPTY
        })      
      )
    } else if (this.action === 'change') {
      const payload = {
        initialize: GeneralValues.YES,
        email: this.loginForm.controls.userName.value,
        password: this.loginForm.controls.newPassword.value
      }
      this.login$ = this._checklistsService.login$(payload)
      .pipe(
        tap((user: any) => {
          if (user) {            
            this.action = 'login';
            const message = $localize`La contraseña se ha cambiado satisfactoriamente<br>`;
            this._sharedService.showSnackMessage({
              message,
              duration: 4000,
              snackClass: 'snack-primary',
              icon: 'check',
            });            
            this.loading = false;            
          }
        }),
        catchError((err) => {
          const message = $localize`Se generó un error en el cambio de contraseña ${err?.error?.message}<br>`;
          this._sharedService.showSnackMessage({
            message,
            duration: 4000,
            snackClass: 'snack-warn',
            icon: 'check',
          });
          this.loading = false;                  
          return EMPTY
        })      
      )
    } else if (this.action === 'changePassword') {
      const payload = {
        changePassword: GeneralValues.YES,
        email: this._sharedService.getUserProfile().email,
        password: this.loginForm.controls.currentPassword.value,
        newPassword: this.loginForm.controls.newPassword.value
      }
      this.login$ = this._checklistsService.login$(payload)
      .pipe(
        tap((user: any) => {
          if (user) {            
            this.action = 'login';
            const message = $localize`La contraseña se ha cambiado satisfactoriamente<br>`;
            this._sharedService.showSnackMessage({
              message,
              duration: 4000,
              snackClass: 'snack-primary',
              icon: 'check',
            });    
            this.loading = false;                  
          }
        }),
        catchError((err) => {
          this.loading = false;                  
          const message = $localize`Se generó un error en el cambio de contraseña ${err?.error?.message}<br>`;
          this._sharedService.showSnackMessage({
            message,
            duration: 4000,
            snackClass: 'snack-warn',
            icon: 'check',
          });
          return EMPTY
        })      
      )
    
    }
    /* this.user$ = this._sharedService.getUserDataGql$({ 
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
        if (!userData) return;
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
    this.submitControlled = false;      */
  } 

  isValidPassword() : boolean {
    const isHard = /[A-Z]/       .test(this.loginForm.controls.newPassword.value) &&
           /[a-z]/       .test(this.loginForm.controls.newPassword.value) &&
           /[0-9]/       .test(this.loginForm.controls.newPassword.value) &&
           /[^A-Za-z0-9]/.test(this.loginForm.controls.newPassword.value) &&
           this.loginForm.controls.newPassword.value.length > 7;

    return this.loginForm.controls.newPassword.value === this.loginForm.controls.confirmation.value &&
           (this.passwordPolicy === 'basic' && this.loginForm.controls.newPassword.value.length > 0 ||
            this.passwordPolicy === 'hard' && isHard ||
            this.passwordPolicy === 'none' ||
            !this.passwordPolicy)
  }

}
