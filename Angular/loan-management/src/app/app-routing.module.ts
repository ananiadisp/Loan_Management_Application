import { Routes } from '@angular/router';
import { DummyHomeComponent } from './dummy-home/dummy-home.component';

/* Routing Module */
const routes: Routes = [
  { path: 'home', component: DummyHomeComponent },
  // { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) },
  // { path: 'loans', loadChildren: () => import('./loans/loans.module').then(m => m.LoansModule) },
  // { path: 'admin', canActivate: [AuthGuard], component: DummyAdminComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }
];
export class AppRoutingModule {}
