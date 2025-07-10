import { Decimal } from 'decimal.js';

export interface LoanDto {
  id: number;
  customerId: number;
  approvedAmount: Decimal;
}
