import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'customers',
    loadComponent: () =>
      import('./customers/index').then((m) => m.CustomerListComponent),
  },
  {
    path: 'customers/:id/details',
    loadComponent: () =>
      import('./customers/index').then((m) => m.CustomerDetailsComponent),
  },
  {
    path: 'loans',
    loadComponent: () =>
      import('./loans/loan-list/loan-list.component').then(
        (m) => m.LoanListComponent
      ),
  },
  {
    path: 'loans/:id/details',
    loadComponent: () =>
      import('./loans/loan-details/loan-details.component').then(
        (m) => m.LoanDetailsComponent
      ),
  },
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
