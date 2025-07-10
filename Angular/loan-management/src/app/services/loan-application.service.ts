import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Loan, LoanStatus } from '../models/loan.model';
import { environment } from '../../environment/environment';
import { Decimal } from 'decimal.js';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationService {
  private readonly apiUrl = `${environment.apiUrl}/loans`;

  constructor(private http: HttpClient) {}

  /**
   * Get all loans
   */
  getLoans(): Observable<Loan[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map((loans) => loans.map((loan) => this.mapToLoan(loan))),
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Get loans by customer ID
   */
  getLoansByCustomerId(customerId: number): Observable<Loan[]> {
    return this.http.get<any[]>(`${this.apiUrl}/customer/${customerId}`).pipe(
      map((loans) => loans.map((loan) => this.mapToLoan(loan))),
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Get loan by ID
   */
  getLoanById(loanId: number): Observable<Loan> {
    return this.http.get<any>(`${this.apiUrl}/${loanId}`).pipe(
      map((loan) => this.mapToLoan(loan)),
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Get loans by status
   */
  getLoansByStatus(status: LoanStatus): Observable<Loan[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<any[]>(`${this.apiUrl}/status`, { params }).pipe(
      map((loans) => loans.map((loan) => this.mapToLoan(loan))),
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Update loan status
   */
  updateLoanStatus(loanId: number, status: LoanStatus): Observable<Loan> {
    const payload = { status };
    return this.http.put<any>(`${this.apiUrl}/${loanId}/status`, payload).pipe(
      map((loan) => this.mapToLoan(loan)),
      catchError(this.handleError)
    );
  }

  /**
   * Approve loan
   */
  approveLoan(
    loanId: number,
    approvedAmount: Decimal,
    interestRate: number,
    termInMonths: number
  ): Observable<Loan> {
    const payload = {
      approvedAmount: approvedAmount.toNumber(),
      interestRate,
      termInMonths,
    };

    return this.http.put<any>(`${this.apiUrl}/${loanId}/approve`, payload).pipe(
      map((loan) => this.mapToLoan(loan)),
      catchError(this.handleError)
    );
  }

  /**
   * Reject loan
   */
  rejectLoan(loanId: number, reason: string): Observable<Loan> {
    const payload = { reason };
    return this.http.put<any>(`${this.apiUrl}/${loanId}/reject`, payload).pipe(
      map((loan) => this.mapToLoan(loan)),
      catchError(this.handleError)
    );
  }

  /**
   * Disburse loan
   */
  disburseLoan(loanId: number): Observable<Loan> {
    return this.http.put<any>(`${this.apiUrl}/${loanId}/disburse`, {}).pipe(
      map((loan) => this.mapToLoan(loan)),
      catchError(this.handleError)
    );
  }

  /**
   * Calculate loan payment
   */
  calculateLoanPayment(
    principal: Decimal,
    interestRate: number,
    termInMonths: number
  ): Observable<Decimal> {
    const params = new HttpParams()
      .set('principal', principal.toString())
      .set('interestRate', interestRate.toString())
      .set('termInMonths', termInMonths.toString());

    return this.http
      .get<any>(`${this.apiUrl}/calculate-payment`, { params })
      .pipe(
        map((result) => new Decimal(result.monthlyPayment || 0)),
        catchError(this.handleError)
      );
  }

  /**
   * Search loans
   */
  searchLoans(searchTerm: string): Observable<Loan[]> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params }).pipe(
      map((loans) => loans.map((loan) => this.mapToLoan(loan))),
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Get paginated loans
   */
  getPaginatedLoans(
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'id',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Observable<{ loans: Loan[]; totalCount: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    return this.http.get<any>(`${this.apiUrl}/paginated`, { params }).pipe(
      map((result) => ({
        loans: result.loans.map((loan: any) => this.mapToLoan(loan)),
        totalCount: result.totalCount,
      })),
      catchError(this.handleError)
    );
  }

  /**
   * Map API response to Loan model
   */
  private mapToLoan(loan: any): Loan {
    return {
      id: loan.id,
      customerId: loan.customerId,
      approvedAmount: new Decimal(loan.approvedAmount || 0),
      requestedAmount: loan.requestedAmount
        ? new Decimal(loan.requestedAmount)
        : undefined,
      interestRate: loan.interestRate,
      termInMonths: loan.termInMonths,
      status: loan.status as LoanStatus,
      applicationDate: new Date(loan.applicationDate),
      approvalDate: loan.approvalDate ? new Date(loan.approvalDate) : undefined,
      disbursementDate: loan.disbursementDate
        ? new Date(loan.disbursementDate)
        : undefined,
      purpose: loan.purpose,
      collateral: loan.collateral,
      monthlyPayment: loan.monthlyPayment
        ? new Decimal(loan.monthlyPayment)
        : undefined,
      remainingBalance: loan.remainingBalance
        ? new Decimal(loan.remainingBalance)
        : undefined,
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
