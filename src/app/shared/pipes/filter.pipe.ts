import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], args: string): any {    
    console.log(value);
    if (!args) {
      return value;
    }
    return value.filter((item) => {
      let filtered = false;
      for (let key  in item) {
        
        if (item[key]) {
          if (typeof item[key] === 'object') {
            for (let innerKey in item[key]) {        
              if (item[key][innerKey]) {
                const value = item[key][innerKey]?.toString();          
                if (value?.toLowerCase().includes(args.toLowerCase())) {
                  filtered = true;
                  break;
                }        
              }
            }
            if (filtered) break;
          } else {
            const value = item[key]?.toString();          
            if (value?.toLowerCase().includes(args.toLowerCase())) {
              filtered = true;
              break;
            }        
          }
        }
      }
      return filtered;
    })    
  }
}
