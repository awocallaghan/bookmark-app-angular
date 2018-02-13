import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import route components
import { OverviewComponent } from './overview/overview.component';
import { ResultsComponent } from './results/results.component';

// Declare application routes
const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent },
  { path: 'overview/:page', component: OverviewComponent },
  { path: 'result/:id', component: ResultsComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}