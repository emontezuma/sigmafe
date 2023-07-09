import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SearchBox, ShowElement } from '../models/screen.models';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private textToSearch: BehaviorSubject<SearchBox> = new BehaviorSubject<SearchBox>({ textToSearch: '', from: '' });
  search: Observable<SearchBox> = this.textToSearch.asObservable();
  private showSearchBox: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  show: Observable<ShowElement> = this.showSearchBox.asObservable();
  private showGeneralLoader: BehaviorSubject<ShowElement> = new BehaviorSubject<ShowElement>({ from: '', show: false });
  showLoader: Observable<ShowElement> = this.showGeneralLoader.asObservable();

  
  constructor() { }

  // Functions ================
  setText(textToSearch: string, from: string) {
    this.textToSearch.next({ textToSearch, from });
  }

  setSearchBox(from: string, showSearchBox: boolean ) {
    this.showSearchBox.next({ from, show: showSearchBox });
  }

  setGeneralLoading(from: string, showLoading: boolean ) {
    this.showGeneralLoader.next({ from, show: showLoading });
  }

  // End ======================
}
