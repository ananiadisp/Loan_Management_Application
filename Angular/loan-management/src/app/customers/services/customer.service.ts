import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { Customer } from '../../models/customer.model';
import { CustomerDetails } from '../../models/customer-details.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`).pipe(
      retry(3),
      catchError((error) => {
        console.error('Error fetching customers:', error);
        return throwError(() => new Error('Failed to load customers'));
      })
    );
  }

  getCustomerDetails(id: number): Observable<CustomerDetails> {
    return this.http
      .get<CustomerDetails>(`${this.apiUrl}/customers/${id}`)
      .pipe(
        retry(3),
        catchError((error) => {
          console.error(`Error fetching customer details for ID ${id}:`, error);
          return throwError(() => new Error('Failed to load customer details'));
        })
      );
  }
}
