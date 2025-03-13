import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

import { ProfileData } from '../models/profile.models';
import { GET_USER } from 'src/app/graphql/graphql.queries';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor (
    private _apollo: Apollo,
  ) { }

// Functions ================  
  getUserData$(userId: number): Observable<any> {
      const variables = {
        userId
      }
  
      return this._apollo.watchQuery({
        query: GET_USER,
        variables
      }).valueChanges
    }

// End ======================
}
