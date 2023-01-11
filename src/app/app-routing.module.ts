import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParkingLotComponent } from './parking-lot/parking-lot.component';

const routes: Routes = [
  { path: 'parking-lot', component: ParkingLotComponent },
  { path: '**', pathMatch: 'full', component: ParkingLotComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
