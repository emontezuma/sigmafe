import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], args: string): any {    
    if (!args) {
      return value;
    }
    return value.filter((item) => {
      let filtered = false;
      for (let key  in item) {
        const value = item[key].toString();
        if (value?.toLowerCase().includes(args.toLowerCase())) {
          filtered = true;
          break;
        }        
      }
      return filtered;
    })    
  }
}
