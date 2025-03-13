import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { catchError, EMPTY, map, Observable, tap } from 'rxjs';
import { ApplicationModules } from 'src/app/shared/models';
import { SharedService } from 'src/app/shared/services';
import { MoldsService } from '../../services';
import { emptyMoldFastQuery, MoldFastQuery } from '../../models';
import { Location } from '@angular/common'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';  
import {
  ScannerQRCodeConfig,
  ScannerQRCodeResult,
  NgxScannerQrcodeService,
  NgxScannerQrcodeComponent,
  ScannerQRCodeSelectedFiles,
  ScannerQRCodeSymbolType,
  NgxScannerQrcodeModule,
  LOAD_WASM
} from 'ngx-scanner-qrcode';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mold-fast-query',
  templateUrl: './mold-fast-query.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./mold-fast-query.component.scss']
})
export class MoldFastQueryComponent implements OnInit, AfterViewInit {
  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  parameters$: Observable<string | Params>;
  loading: boolean;
  loaded: boolean;
  textToSearch: string = '';

  referenceField = new FormControl();
  
  mold: MoldFastQuery = emptyMoldFastQuery;
  mold$: Observable<any>;

   public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth,
      },
    },
  }
  
  constructor(
    private _route: ActivatedRoute,    
    public _sharedService: SharedService,
    public _moldsService: MoldsService,  
    private _location: Location,    
  ) {}

  // Hooks ====================
  ngOnInit() {
    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['reference']) {
          this.requestMoldData(params['reference']);
          this.referenceField.setValue(params['reference']);          
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {
      // this.handle(this.action, 'start');
    });
  }

  sendSearchText(event: any) {
    if (event?.length > 0) {
      this.requestMoldData(event);
      this._location.replaceState(`/molds/query/${event}`);  
    } else {
      this.mold = emptyMoldFastQuery;
    }
    
  }

  onEvent(e: ScannerQRCodeResult[], action?: any): void {
    // e && action && action.pause();
    if (e.length > 0 && e[0].value) {        
      const referenceToSearch = e[0].value;
      this.requestMoldData(referenceToSearch);
      this._location.replaceState(`/molds/query/${referenceToSearch}`);  
      this.referenceField.setValue(referenceToSearch);
    } else {
      this.mold = emptyMoldFastQuery;
      this.loading = false;
    }
  }

  requestMoldData(moldReference: string): void {
  const skipRecords = 0;
  const filter = {
    or: [{
      reference: { 
      eq: moldReference
      }
    },{
      serialNumber: { 
      eq: moldReference
      }
    }]    
  }
  const order = null
  // let getData: boolean = false;
  this.setViewLoading(true);
  this.loading = true;
  this.mold$ = this._moldsService.getMoldDataGql$({      
      filter,
    })
    .pipe(
      map((moldGqlData) => {
        return this._moldsService.mapOneFastMold(moldGqlData);
      }),
      tap((mold: MoldFastQuery) => {
        if (!mold) {
          this.mold = emptyMoldFastQuery;
          const message = $localize`El Molde no existe...`;
          this._sharedService.showSnackMessage({
            message,
            duration: 2500,
            snackClass: 'snack-warn',
            icon: 'check',
          });
          this.setViewLoading(false);
          this.loaded = true;   
          this.loading = false;
          return;
        }

        this.mold = mold;
        this.setViewLoading(false);
        this.loaded = true;
        this.loading = false;
      }),
      catchError((err) => {
        this.setViewLoading(false);
        this.loading = false;
        return EMPTY;
      })
    );
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
}
