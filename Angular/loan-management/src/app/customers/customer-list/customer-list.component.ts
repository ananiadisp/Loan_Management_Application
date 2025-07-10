import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  imports: [CommonModule],
  providers: [CustomerService],
})
export class CustomerListComponent implements OnInit {
  customers: any[] = [];
  now = new Date();
  loading = true;
  error = '';

  constructor(private customerService: CustomerService) {
    if (customerService == null) {
      throw new Error('CustomerService is not provided');
    }
  }

  ngOnInit() {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load customers';
        this.loading = false;
      },
    });
  }

  select(customer: any) {
    console.log('Selected:', customer);
  }
}
