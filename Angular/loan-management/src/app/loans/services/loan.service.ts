import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Loan, LoanStatus } from '../../models/loan.model';
import { environment } from '../../../environment/environment';
import { Decimal } from 'decimal.js';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private readonly apiUrl = `${environment.apiUrl}/loans`;

  constructor(private http: HttpClient) {}

  /**
   * Get all loans
   */
  getLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}`).pipe(
      map((loans) => loans.map((loan) => this.mapToLoan(loan))),
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Get loan by ID
   */
  // getLoanById(loanId: number): Observable<Loan> {
  //   return this.http.get<any>(`${this.apiUrl}/${loanId}`).pipe(
  //     map((loan) => this.mapToLoan(loan)),
  //     retry(2),
  //     catchError(this.handleError)
  //   );
  // }

  /**
   * Get loans by customer ID
   */
  // getLoansByCustomerId(customerId: number): Observable<Loan[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/customer/${customerId}`).pipe(
  //     map((loans) => loans.map((loan) => this.mapToLoan(loan))),
  //     retry(2),
  //     catchError(this.handleError)
  //   );
  // }

  /**
   * Get loans by status
   */
  // getLoansByStatus(status: LoanStatus): Observable<Loan[]> {
  //   const params = new HttpParams().set('status', status);
  //   return this.http.get<any[]>(`${this.apiUrl}/status`, { params }).pipe(
  //     map((loans) => loans.map((loan) => this.mapToLoan(loan))),
  //     retry(2),
  //     catchError(this.handleError)
  //   );
  // }

  /**
   * Search loans
   */
  // searchLoans(searchTerm: string): Observable<Loan[]> {
  //   const params = new HttpParams().set('search', searchTerm);
  //   return this.http.get<any[]>(`${this.apiUrl}/search`, { params }).pipe(
  //     map((loans) => loans.map((loan) => this.mapToLoan(loan))),
  //     retry(2),
  //     catchError(this.handleError)
  //   );
  // }

  /**
   * Get paginated loans
   */
  // getPaginatedLoans(
  //   page: number = 1,
  //   pageSize: number = 10,
  //   sortBy: string = 'id',
  //   sortOrder: 'asc' | 'desc' = 'desc',
  //   filters?: {
  //     status?: LoanStatus;
  //     customerId?: number;
  //     minAmount?: number;
  //     maxAmount?: number;
  //   }
  // ): Observable<{
  //   loans: Loan[];
  //   totalCount: number;
  //   currentPage: number;
  //   totalPages: number;
  // }> {
  //   let params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('pageSize', pageSize.toString())
  //     .set('sortBy', sortBy)
  //     .set('sortOrder', sortOrder);

  //   if (filters) {
  //     if (filters.status) {
  //       params = params.set('status', filters.status);
  //     }
  //     if (filters.customerId) {
  //       params = params.set('customerId', filters.customerId.toString());
  //     }
  //     if (filters.minAmount) {
  //       params = params.set('minAmount', filters.minAmount.toString());
  //     }
  //     if (filters.maxAmount) {
  //       params = params.set('maxAmount', filters.maxAmount.toString());
  //     }
  //   }

  //   return this.http.get<any>(`${this.apiUrl}/paginated`, { params }).pipe(
  //     map((result) => ({
  //       loans: result.loans.map((loan: any) => this.mapToLoan(loan)),
  //       totalCount: result.totalCount,
  //       currentPage: result.currentPage,
  //       totalPages: result.totalPages,
  //     })),
  //     catchError(this.handleError)
  //   );
  // }

  // /**
  //  * Get loan summary statistics
  //  */
  // getLoanSummary(): Observable<LoanSummary> {
  //   return this.http.get<any>(`${this.apiUrl}/summary`).pipe(
  //     map((summary) => ({
  //       totalLoans: summary.totalLoans,
  //       totalAmount: new Decimal(summary.totalAmount || 0),
  //       activeLoans: summary.activeLoans,
  //       pendingLoans: summary.pendingLoans,
  //       averageAmount: new Decimal(summary.averageAmount || 0),
  //     })),
  //     catchError(this.handleError)
  //   );
  // }

  // /**
  //  * Update loan
  //  */
  // updateLoan(loanId: number, loan: Partial<Loan>): Observable<Loan> {
  //   const payload = {
  //     ...loan,
  //     approvedAmount: loan.approvedAmount?.toNumber(),
  //     requestedAmount: loan.requestedAmount?.toNumber(),
  //     monthlyPayment: loan.monthlyPayment?.toNumber(),
  //     remainingBalance: loan.remainingBalance?.toNumber(),
  //   };

  //   return this.http.put<any>(`${this.apiUrl}/${loanId}`, payload).pipe(
  //     map((result) => this.mapToLoan(result)),
  //     catchError(this.handleError)
  //   );
  // }

  /**
   * Delete loan
   */
  // deleteLoan(loanId: number): Observable<void> {
  //   return this.http
  //     .delete<void>(`${this.apiUrl}/${loanId}`)
  //     .pipe(catchError(this.handleError));
  // }

  /**
   * Map API response to Loan model
   */
  private mapToLoan(loan: any): Loan {
    return {
      loanId: loan.id,
      customerId: loan.customerId,
      applicationId: loan.applicationId,
      loanProductId: loan.loanProductId,
      approvedAmount: new Decimal(loan.approvedAmount || 0),
      maturityDate: new Date(loan.maturityDate),
      interestRate: loan.interestRate,
      currentBalance: new Decimal(loan.currentBalance || 0),
      originalTermMonths: loan.originalTermMonths,
      loanStatus: loan.status as LoanStatus,
      lastPaymentDate: loan.lastPaymentDate,
      nextPaymentDueDate: loan.nextPaymentDueDate,
      disbursementDate: loan.disbursementDate
        ? new Date(loan.disbursementDate)
        : null,
      application: loan.application,
      customer: loan.customer,
      loanProduct: loan.loanProduct,
    };
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request - Please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized - Please log in';
          break;
        case 403:
          errorMessage = "Forbidden - You don't have permission";
          break;
        case 404:
          errorMessage = 'Not Found - The requested resource was not found';
          break;
        case 500:
          errorMessage = 'Internal Server Error - Please try again later';
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    console.error('Loan Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
