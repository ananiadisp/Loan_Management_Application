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
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
