import { Routes } from '@angular/router';
import { FirstPageComponent } from './first-page/first-page.component';
import { SecondPageComponent } from './second-page/second-page.component';

export const appRoutes: Routes = [
  { path: 'first-page', component: FirstPageComponent },
  { path: 'second-page', component: SecondPageComponent },
  { path: '**', redirectTo: '/first-page' }
];
