import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../services/loan.service';
import { Loan, LoanStatus } from '../../models/loan.model';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss'],
  providers: [LoanService],
})
export class LoanListComponent implements OnInit, OnDestroy {
  loans: Loan[] = [];
  loading = true;
  error = '';

  public readonly loans$: Observable<Loan[]>;
  public readonly filteredLoans$: Observable<Loan[]>;
  private readonly loansSubject: BehaviorSubject<Loan[]> = new BehaviorSubject<
    Loan[]
  >([]);
  private readonly searchTermSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private readonly statusFilterSubject: BehaviorSubject<LoanStatus | null> =
    new BehaviorSubject<LoanStatus | null>(null);
  private readonly destroy$ = new Subject<void>();

  // Filter properties
  selectedStatus: LoanStatus | null = null;
  searchTerm = '';

  // Loan status enum for template
  LoanStatus = LoanStatus;

  constructor(private loanService: LoanService, private router: Router) {
    this.loans$ = this.loansSubject.asObservable();
    // Create filtered loans observable
    this.filteredLoans$ = combineLatest([this.loans$]).pipe(
      map(([loans]) => {
        return loans;
      })
    );
  }

  ngOnInit() {
    this.loadLoans();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLoans() {
    this.error = '';

    this.loanService
      .getLoans()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.loansSubject.next(data);
          this.loans = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load loans';
          this.loading = false;
          console.error('Error loading loans:', err);
        },
      });
  }

  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.searchTermSubject.next(searchTerm);
  }

  onStatusFilterChange(status: LoanStatus | null) {
    this.selectedStatus = status;
    this.statusFilterSubject.next(status);
  }

  viewLoan(loan: Loan) {
    this.router.navigate(['/loans', loan.loanId, 'details']);
  }

  public select(loan: Loan) {
    console.log('Selected:', loan);
    this.router.navigate([`/loans/${loan.loanId}/details`]);
  }

  getStatusClass(status: LoanStatus): string {
    switch (status) {
      case LoanStatus.ACTIVE:
        return 'status-active';
      case LoanStatus.APPROVED:
        return 'status-approved';
      case LoanStatus.PENDING:
        return 'status-pending';
      case LoanStatus.REJECTED:
        return 'status-rejected';
      case LoanStatus.CLOSED:
        return 'status-closed';
      case LoanStatus.DEFAULTED:
        return 'status-defaulted';
      case LoanStatus.DISBURSED:
        return 'status-disbursed';
      default:
        return 'status-default';
    }
  }

  getStatusIcon(status: LoanStatus): string {
    switch (status) {
      case LoanStatus.ACTIVE:
        return '✅';
      case LoanStatus.APPROVED:
        return '👍';
      case LoanStatus.PENDING:
        return '⏳';
      case LoanStatus.REJECTED:
        return '❌';
      case LoanStatus.CLOSED:
        return '🔒';
      case LoanStatus.DEFAULTED:
        return '⚠️';
      case LoanStatus.DISBURSED:
        return '💰';
      default:
        return '📋';
    }
  }
}
