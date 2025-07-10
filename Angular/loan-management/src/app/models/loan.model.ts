import { Decimal } from 'decimal.js';
export interface Loan {
  id: number;
  customerId: number;
  approvedAmount: Decimal;
}
