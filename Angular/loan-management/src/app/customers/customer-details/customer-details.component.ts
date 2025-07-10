import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { CustomerDetails } from '../../models/customer-details.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  imports: [CommonModule],
})
export class CustomerDetailsComponent implements OnInit {
  public customerDetails: CustomerDetails | null = null;
  public readonly loaded$: Observable<boolean>;
  public readonly customerDetails$: Observable<CustomerDetails | null>;
  private readonly customerDetailsSubject: BehaviorSubject<CustomerDetails | null> =
    new BehaviorSubject<CustomerDetails | null>(null);

  private readonly loadedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  constructor(private service: CustomerService, private route: ActivatedRoute) {
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
}
