import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yearsSince',
  standalone: true,
})
export class YearsSincePipe implements PipeTransform {
  transform(value: string | Date): number {
    if (!value) return 0;
    const then = new Date(value);
    const now = new Date();
    let years = now.getFullYear() - then.getFullYear();
    if (
      now.getMonth() < then.getMonth() ||
      (now.getMonth() === then.getMonth() && now.getDate() < then.getDate())
    ) {
      years--;
    }
    return years;
  }
}
