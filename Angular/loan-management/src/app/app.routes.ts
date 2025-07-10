import { Routes } from '@angular/router';
import { DummyHomeComponent } from './dummy-home/dummy-home.component';

export const routes: Routes = [
  { path: 'home', component: DummyHomeComponent },
  {
    path: 'customers',
    loadChildren: () =>
      import('./customers/index').then((m) => m.CustomerListComponent),
  },
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },
];
