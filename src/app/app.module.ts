import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParkingLotComponent } from './parking-lot/parking-lot.component';

import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';

@NgModule({
  declarations: [
    AppComponent,
    ParkingLotComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    CardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
