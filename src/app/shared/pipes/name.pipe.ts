import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name',
  standalone: true
})
export class NamePipe implements PipeTransform {

  transform(value: string): string {
    const names = value.split(' ');
    if (names.at(0) && names.at(-1))
      return names.at(0) +' '+ names.at(-1)!;
    return value;
  }

}
