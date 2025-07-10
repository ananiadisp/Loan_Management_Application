import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { CommonModule } from '@angular/common';
import { YearsSincePipe } from '../../shared/years-since.pipe';
import { PaletteDirective } from '../../shared/palette.directive';
import { Customer } from '../../models/customer.model';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  standalone: true,
  imports: [CommonModule, YearsSincePipe, PaletteDirective, SearchBarComponent],
  providers: [CustomerService],
})
export class CustomerListComponent implements OnInit {
  customers: any[] = [];
  now = new Date();
  loading = true;
  error = '';

  public readonly customers$: Observable<Customer[] | null>;
  public readonly filteredCustomers$: Observable<Customer[]>;
  private readonly customersSubject: BehaviorSubject<Customer[] | null> =
    new BehaviorSubject<Customer[] | null>(null);
  private readonly searchTermSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private readonly filtersSubject: BehaviorSubject<{
    activeOnly: boolean;
    importantOnly: boolean;
  }> = new BehaviorSubject<{ activeOnly: boolean; importantOnly: boolean }>({
    activeOnly: false,
    importantOnly: false,
  });

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {
    this.customers$ = this.customersSubject.asObservable();

    // Create filtered customers observable
    this.filteredCustomers$ = combineLatest([
      this.customers$,
      this.searchTermSubject.asObservable(),
      this.filtersSubject.asObservable(),
    ]).pipe(
      map(([customers, searchTerm, filters]) => {
        console.log('Filter pipe executing with:', {
          customers: customers?.length,
          searchTerm,
          filters,
        });
        if (!customers) return [];

        let filtered = customers;

        // Apply search filter
        if (searchTerm && searchTerm.trim()) {
          const term = searchTerm.toLowerCase().trim();
          console.log('Applying search filter with term:', term);
          filtered = filtered.filter(
            (customer) =>
              customer.firstName.toLowerCase().includes(term) ||
              customer.lastName.toLowerCase().includes(term) ||
              customer.email.toLowerCase().includes(term) ||
              customer.phone.includes(term)
          );
          console.log('After search filter:', filtered.length, 'customers');
        }

        // Apply active filter
        if (filters.activeOnly) {
          console.log('Applying active filter');
          filtered = filtered.filter((customer) => customer.isActive);
          console.log('After active filter:', filtered.length, 'customers');
        }

        // Apply important customer filter
        if (filters.importantOnly) {
          console.log('Applying important filter');
          filtered = filtered.filter((customer) =>
            this.isImportantCustomer(customer.registrationDate)
          );
          console.log('After important filter:', filtered.length, 'customers');
        }

        console.log('Final filtered result:', filtered.length, 'customers');
        return filtered;
      })
    );
  }

  ngOnInit() {
    console.log('CustomerListComponent initializing...');
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        console.log('Customers loaded:', data);
        this.customersSubject.next(data);
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.error = err.message || 'Failed to load customers';
        this.loading = false;
      },
    });
  }

  public select(customer: Customer) {
    console.log('Selected:', customer);
    this.router.navigate([`/customers/${customer.customerID}/details`]);
  }

  public onSearchChange(searchTerm: string) {
    console.log('CustomerListComponent received search term:', searchTerm);
    this.searchTermSubject.next(searchTerm);
  }

  public onFiltersChange(filters: {
    activeOnly: boolean;
    importantOnly: boolean;
  }) {
    console.log('CustomerListComponent received filters:', filters);
    this.filtersSubject.next(filters);
  }

  public isImportantCustomer(registrationDate: Date): boolean {
    const regYear = new Date(registrationDate).getFullYear();
    const nowYear = new Date().getFullYear();
    return nowYear - regYear > 5;
  }
}
