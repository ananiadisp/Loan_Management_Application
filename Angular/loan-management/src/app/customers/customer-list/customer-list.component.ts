import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { CommonModule } from '@angular/common';
import { YearsSincePipe } from '../../shared/years-since.pipe';
import { PaletteDirective } from '../../shared/palette.directive';
import { Customer } from '../../models/customer.model';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  imports: [CommonModule, YearsSincePipe, PaletteDirective],
  providers: [CustomerService],
})
export class CustomerListComponent implements OnInit {
  customers: any[] = [];
  now = new Date();
  loading = true;
  error = '';
  public readonly customers$: Observable<Customer[] | null>;
  private readonly customersSubject: BehaviorSubject<Customer[] | null> =
    new BehaviorSubject<Customer[] | null>(null);

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {
    this.customers$ = this.customersSubject.asObservable();
  }

  ngOnInit() {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customersSubject.next(data);
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load customers';
        this.loading = false;
      },
    });
  }

  public select(customer: Customer) {
    console.log('Selected:', customer);
    this.router.navigate([`/customers/${customer.customerID}/details`]);
  }

  public isImportantCustomer(registrationDate: Date): boolean {
    const regYear = new Date(registrationDate).getFullYear();
    const nowYear = new Date().getFullYear();
    return nowYear - regYear > 5;
  }
}
