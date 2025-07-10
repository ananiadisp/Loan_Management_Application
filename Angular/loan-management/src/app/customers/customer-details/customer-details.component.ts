import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { CustomerDetails } from '../../models/customer-details.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { YearsSincePipe } from '../../shared/years-since.pipe';
import { Location } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  imports: [CommonModule, YearsSincePipe],
})
export class CustomerDetailsComponent implements OnInit {
  public customerDetails: CustomerDetails | null = null;
  public readonly loaded$: Observable<boolean>;
  public readonly customerDetails$: Observable<CustomerDetails | null>;
  private readonly customerDetailsSubject: BehaviorSubject<CustomerDetails | null> =
    new BehaviorSubject<CustomerDetails | null>(null);

  private readonly loadedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private service: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.customerDetails$ = this.customerDetailsSubject.asObservable();
    this.loaded$ = this.loadedSubject.asObservable();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getCustomerDetails(+id).subscribe((data) => {
        this.customerDetails = data;
        this.customerDetailsSubject.next(data);
        this.loadedSubject.next(true);
      });
    }
  }

  goBack() {
    this.location.back();
  }

  viewLoan(loanId: number) {
    this.router.navigate(['/loans', loanId, 'details']);
  }
}
