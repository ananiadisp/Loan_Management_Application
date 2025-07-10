import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="loan-details">
      <h2>Loan Details</h2>
      <div class="details-card">
        <h3>Loan Information</h3>
        <div class="detail-row">
          <span class="label">Loan ID:</span>
          <span class="value">LN-2024-001</span>
        </div>
        <div class="detail-row">
          <span class="label">Loan Type:</span>
          <span class="value">Personal Loan</span>
        </div>
        <div class="detail-row">
          <span class="label">Amount:</span>
          <span class="value">$25,000</span>
        </div>
        <div class="detail-row">
          <span class="label">Interest Rate:</span>
          <span class="value">8.5%</span>
        </div>
        <div class="detail-row">
          <span class="label">Term:</span>
          <span class="value">24 months</span>
        </div>
        <div class="detail-row">
          <span class="label">Status:</span>
          <span class="value status-active">Active</span>
        </div>
        <div class="actions">
          <button class="btn btn-primary">Edit Loan</button>
          <button class="btn btn-secondary" routerLink="/loans">
            Back to Loans
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .loan-details {
        padding: 20px;
      }
      .details-card {
        background: white;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        max-width: 600px;
      }
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
      }
      .label {
        font-weight: 600;
        color: #555;
      }
      .value {
        color: #333;
      }
      .status-active {
        color: #28a745;
        font-weight: 600;
      }
      .actions {
        margin-top: 20px;
        display: flex;
        gap: 10px;
      }
      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      .btn-primary {
        background: #007bff;
        color: white;
      }
      .btn-secondary {
        background: #6c757d;
        color: white;
      }
      .btn:hover {
        opacity: 0.9;
      }
    `,
  ],
})
export class LoanDetailsComponent {}
