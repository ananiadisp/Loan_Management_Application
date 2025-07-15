import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoanService } from '../services/loan.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss'],
  providers: [LoanService],
})
export class LoanDetailsComponent {
  public loanDetails: Loan | null = null;
  public readonly loaded$: Observable<boolean>;
  public readonly loanDetails$: Observable<Loan | null>;
  private readonly loanDetailsSubject: BehaviorSubject<Loan | null> =
    new BehaviorSubject<Loan | null>(null);

  private readonly loadedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public showLoanApplicationForm = false;

  constructor(
    private service: LoanService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.loanDetails$ = this.loanDetailsSubject.asObservable();
    this.loaded$ = this.loadedSubject.asObservable();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLoan(+id);
    }
  }

  private loadLoan(id: number) {
    this.service.getLoan(id).subscribe((data) => {
      this.loanDetails = data;
      this.loanDetailsSubject.next(data);
      this.loadedSubject.next(true);
    });
  }

  goBack() {
    this.location.back();
  }

  viewLoan(loanId: number) {
    this.router.navigate(['/loans', loanId, 'details']);
  }
}
