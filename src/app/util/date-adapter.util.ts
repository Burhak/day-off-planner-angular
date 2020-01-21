import { NativeDateAdapter } from 'saturn-datepicker';

export class CustomDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1;
  }
}
