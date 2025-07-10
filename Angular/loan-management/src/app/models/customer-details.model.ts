import { Loan } from './loan.model';

export interface CustomerDetails {
  id: number;
  firstName: string;
  lastName: string;
  registrationDate: Date;
  loans: Loan[];
}
