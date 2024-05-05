import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { GET_PROVIDERS_LAZY_LOADING, GET_MANUFACTURERS_LAZY_LOADING, GET_GENERICS_LAZY_LOADING, GET_HARDCODED_VALUES } from 'src/app/graphql/graphql.queries';

@Injectable({
  providedIn: 'root'
})

export class CatalogsService {

  constructor (
    private apollo: Apollo,    
  ) {}
  
// Functions ================  
  getpProvidersLazyLoadingDataGql$(recosrdsToSkip: number = 0, recosrdsToTake: number = 50, filterBy: any = null, orderBy: any = null): Observable<any> {
    let variables = undefined;
    if (recosrdsToSkip !== 0) {
      variables = { recosrdsToSkip };
    }
    if (recosrdsToTake !== 0) {
      if (variables) {         
        variables = { ...variables, recosrdsToTake };
      } else {
        variables = { recosrdsToTake };
      }      
    }
    if (orderBy) {
      if (variables) {         
        variables = { ...variables, orderBy };
      } else {
        variables = { orderBy };
      }
    }        
    if (filterBy) {
      if (variables) {         
        variables = { ...variables, filterBy };
      } else {
        variables = { filterBy };
      }    
    }
    
    return this.apollo.watchQuery({ 
      query: GET_PROVIDERS_LAZY_LOADING, 
      variables, 
      context: { 
        headers: { 
          'x-customer-id': '1', 
          'x-language-id': '1',  
        }
      } 
    }).valueChanges;
  }

  getManufacturersLazyLoadingDataGql$(recosrdsToSkip: number = 0, recosrdsToTake: number = 50, filterBy: any = null, orderBy: any = null): Observable<any> {
    let variables = undefined;
    if (recosrdsToSkip !== 0) {
      variables = { recosrdsToSkip };
    }
    if (recosrdsToTake !== 0) {
      if (variables) {         
        variables = { ...variables, recosrdsToTake };
      } else {
        variables = { recosrdsToTake };
      }      
    }
    if (orderBy) {
      if (variables) {         
        variables = { ...variables, orderBy };
      } else {
        variables = { orderBy };
      }
    }        
    if (filterBy) {
      if (variables) {         
        variables = { ...variables, filterBy };
      } else {
        variables = { filterBy };
      }    
    }
    
    return this.apollo.watchQuery({ 
      query: GET_MANUFACTURERS_LAZY_LOADING, 
      variables, 
      context: { 
        headers: { 
          'x-customer-id': '1', 
          'x-language-id': '1',  
        }
      } 
    }).valueChanges;
  }

  getGenericsLazyLoadingDataGql$(recosrdsToSkip: number = 0, recosrdsToTake: number = 50, filterBy: any = null, orderBy: any = null): Observable<any> {
    let variables = undefined;
    if (recosrdsToSkip !== 0) {
      variables = { recosrdsToSkip };
    }
    if (recosrdsToTake !== 0) {
      if (variables) {         
        variables = { ...variables, recosrdsToTake };
      } else {
        variables = { recosrdsToTake };
      }      
    }
    if (orderBy) {
      if (variables) {         
        variables = { ...variables, orderBy };
      } else {
        variables = { orderBy };
      }
    }        
    if (filterBy) {
      if (variables) {         
        variables = { ...variables, filterBy };
      } else {
        variables = { filterBy };
      }    
    }

    return this.apollo.watchQuery({ 
      query: GET_GENERICS_LAZY_LOADING, 
      variables, 
      context: { 
        headers: { 
          'x-customer-id': '1', 
          'x-language-id': '1',  
        }
      } 
    }).valueChanges;
  }

  getHardcodedValuesDataGql$(recosrdsToSkip: number = 0, recosrdsToTake: number = 50, filterBy: any = null, orderBy: any = null): Observable<any> {

    // No filters, skip or take records applied to the hardcode values table but the tableNamefield, 
    // This is because this values list must be short

    let variables = undefined;
    recosrdsToSkip = 0;
    recosrdsToTake = 0;
    if (recosrdsToSkip !== 0) {
      variables = { recosrdsToSkip };
    }
    if (recosrdsToTake !== 0) {
      if (variables) {         
        variables = { ...variables, recosrdsToTake };
      } else {
        variables = { recosrdsToTake };
      }      
    }
    if (orderBy) {
      if (variables) {         
        variables = { ...variables, orderBy };
      } else {
        variables = { orderBy };
      }
    }            
    if (filterBy) {
      if (variables) {         
        variables = { ...variables, filterBy };
      } else {
        variables = { filterBy };
      }    
    }

    return this.apollo.watchQuery({ 
      query: GET_HARDCODED_VALUES, 
      variables, 
      context: { 
        headers: { 
          'x-customer-id': '1', 
          'x-language-id': '1',  
        }
      } 
    }).valueChanges;
  }

// End ======================  
}
