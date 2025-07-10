import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found">
      <div class="content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <button class="btn" routerLink="/home">Go Home</button>
      </div>
    </div>
  `,
  styles: [
    `
      .not-found {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
        text-align: center;
      }
      .content h1 {
        font-size: 120px;
        margin: 0;
        color: #007bff;
        font-weight: 700;
      }
      .content h2 {
        font-size: 36px;
        margin: 10px 0;
        color: #333;
      }
      .content p {
        font-size: 18px;
        color: #666;
        margin: 20px 0;
      }
      .btn {
        background: #007bff;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        text-decoration: none;
      }
      .btn:hover {
        background: #0056b3;
      }
    `,
  ],
})
export class PageNotFoundComponent {}
