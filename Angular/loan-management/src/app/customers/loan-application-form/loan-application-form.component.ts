import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoanApplicationService } from '../../services/loan-application.service';
import { LoanProductDto } from '../../models/loan-product-dto.model';
import { CreateLoanApplicationDto } from '../../models/create-loan-application-dto.model';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { EmployeeDto } from '../../models/employee-dto';

@Component({
  selector: 'app-loan-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-application-form.component.html',
  styleUrls: ['./loan-application-form.component.scss'],
})
export class LoanApplicationFormComponent implements OnInit {
  @Input() customerId!: number;
  @Output() formSubmitted = new EventEmitter<void>();
  @Output() formCancelled = new EventEmitter<void>();

  loanApplicationForm: FormGroup;
  loanProducts: LoanProductDto[] = [];
  assignedEmployees: EmployeeDto[] = [];
  public readonly loading$: Observable<boolean>;
  private readonly loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private loanApplicationService: LoanApplicationService
  ) {
    this.loading$ = this.loadingSubject.asObservable();
    this.loanApplicationForm = this.fb.group({
      loanProductId: ['', [Validators.required]],
      assignedEmployeeId: ['', [Validators.required]],
      requestedAmount: [
        '',
        [Validators.required, Validators.min(1), Validators.max(1000000)],
      ],
    });
  }

  ngOnInit() {
    this.loadLoanProducts();
  }

  private loadLoanProducts() {
    this.loadingSubject.next(true);
    this.error = '';

    combineLatest([
      this.loanApplicationService.getAllEmployees(),
      this.loanApplicationService.getAllLoanProducts(),
    ]).subscribe({
      next: ([employees, products]) => {
        this.assignedEmployees = employees;
        this.loanProducts = products;
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.error = err.message || 'Failed to load employees or loan products';
        this.loadingSubject.next(false);
        console.error('Error loading employees or loan products:', err);
      },
    });
  }

  onSubmit() {
    if (this.loanApplicationForm.valid && !this.submitting) {
      this.submitting = true;
      this.error = '';

      const formValue = this.loanApplicationForm.value;
      const createLoanApplicationDto: CreateLoanApplicationDto = {
        customerId: this.customerId,
        loanProductId: parseInt(formValue.loanProductId),
        assignedEmployeeId: parseInt(formValue.assignedEmployeeId),
        requestedAmount: parseFloat(formValue.requestedAmount),
      };

      this.loanApplicationService
        .submitLoanApplication(createLoanApplicationDto)
        .subscribe({
          next: (applicationId) => {
            console.log(
              'Loan application submitted successfully. ID:',
              applicationId
            );
            this.submitting = false;
            this.formSubmitted.emit();
          },
          error: (err) => {
            this.error = err.message || 'Failed to submit loan application';
            this.submitting = false;
            console.error('Error submitting loan application:', err);
          },
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.formCancelled.emit();
  }

  private markFormGroupTouched() {
    Object.keys(this.loanApplicationForm.controls).forEach((key) => {
      const control = this.loanApplicationForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loanApplicationForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName} is required`;
      }
      if (control.errors['min']) {
        return `${fieldName} must be greater than ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `${fieldName} must be less than ${control.errors['max'].max}`;
      }
    }
    return '';
  }
}
