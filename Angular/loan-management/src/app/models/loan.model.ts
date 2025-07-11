import { Decimal } from 'decimal.js';
import { Customer } from './customer.model';
import { LoanProduct } from './loan-product.model';
import { LoanApplication } from './loan-application.model';

export interface Loan {
  loanId: number;
  applicationId: number;
  customerId: number;
  loanProductId: number;
  approvedAmount: Decimal;
  disbursementDate: Date | null;
  maturityDate: Date;
  interestRate: Decimal;
  currentBalance: Decimal;
  originalTermMonths: number;
  loanStatus: LoanStatus;
  lastPaymentDate?: Date;
  nextPaymentDueDate?: Date;

  application: LoanApplication;
  customer: Customer;
  loanProduct: LoanProduct;
}

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  DEFAULTED = 'DEFAULTED',
}
