import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Parking, Vehicle } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  readonly API_URL = 'http://localhost:4000/api/';

  constructor(private http: HttpClient) { }

  getParking(): Observable<any> {
    return this.http.get(this.API_URL + 'parking');
  }

  updateParking(parking: Parking): Observable<Parking> {
    return this.http.put<Parking>(this.API_URL + 'updateParking', parking).pipe(
      tap((updatedParking: Parking) => console.log(`updated parking`)),
      catchError(this.handleError<Parking>('updatedParking'))
    )
  }

  getEntrances(): Observable<any> {
    return this.http.get(this.API_URL + 'entrance');
  }

  getParkedVehicles(): Observable<any> {
    return this.http.get(this.API_URL + 'parked');
  }

  getUnparkedVehicles(): Observable<any> {
    return this.http.get(this.API_URL + 'unparked');
  }

  parkVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.API_URL + 'parkVehicle', vehicle).pipe(
      tap((newVehicle: Vehicle) => console.log(`added new vehicle`)),
      catchError(this.handleError<Vehicle>('parkedVehicle'))
    )
  }

  unparkVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(this.API_URL + 'unparkVehicle', vehicle).pipe(
      tap((unparkedVehicle: Vehicle) => console.log('unparked vehicle')),
      catchError(this.handleError<Vehicle>('unparkedVehicle'))
    )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
