import { Component } from '@angular/core';
import { newVehicle, ParkingSlotType, VehicleType } from '../model';
import { ParkingSpot } from '../parkingSpot.model';

const TOTAL_ENTRY_POINT = ['A', 'B', 'C'];

@Component({
  selector: 'app-parking-lot',
  templateUrl: './parking-lot.component.html',
  styleUrls: ['./parking-lot.component.css']
})
export class ParkingLotComponent {

  entryPoints = ['A', 'B', 'C'];
  parkingLot: ParkingSpot[]  = [
    new ParkingSpot(1, ParkingSlotType.SP, [1, 7, 10], true),
    new ParkingSpot(2, ParkingSlotType.SP, [2, 6, 9], true),
    new ParkingSpot(3, ParkingSlotType.SP, [3, 5, 8], true),
    new ParkingSpot(4, ParkingSlotType.SP, [4, 4, 7], true),
    new ParkingSpot(5, ParkingSlotType.SP, [5, 3, 6], true),
    new ParkingSpot(6, ParkingSlotType.SP, [6, 4, 5], true),
    new ParkingSpot(7, ParkingSlotType.MP, [6, 3, 4], true),
    new ParkingSpot(8, ParkingSlotType.MP, [5, 2, 5], true),
    new ParkingSpot(9, ParkingSlotType.MP, [4, 3, 4], true),
    new ParkingSpot(10, ParkingSlotType.MP, [2, 4, 5], true),
    new ParkingSpot(11, ParkingSlotType.MP, [2, 5, 4], true),
    new ParkingSpot(12, ParkingSlotType.MP, [3, 4, 3], true),
    new ParkingSpot(13, ParkingSlotType.MP, [4, 3, 2], true),
    new ParkingSpot(14, ParkingSlotType.MP, [5, 2, 1], true),
    new ParkingSpot(15, ParkingSlotType.LP, [5, 1, 3], true),
    new ParkingSpot(16, ParkingSlotType.LP, [4, 2, 4], true),
    new ParkingSpot(17, ParkingSlotType.LP, [3, 3, 5], true),
  ]

  parkingStatus: string | undefined = '';
  newVehicle: newVehicle = {
    entryPoint: '',
    vehicleType: ''
  };

  ngOnit(){

  }

  onSubmit() {

  }

  parkVehicle(vehicle: newVehicle): void {
    let response;
    if (this.parkingLot.every(parking => parking.isVacant === false)) {
      response = 'The parking lot is full';
    } else if (vehicle.vehicleType === VehicleType.L) {
      const largeSpotsAvailable = this.parkingLot.filter(v => v.size === ParkingSlotType.LP && v.isVacant);
      if (largeSpotsAvailable.length > 1) {
        response = 'The parking for LARGE vehicle is full';
      } else {
        const selectedSpot = this.findNearestParkingSpot(vehicle.entryPoint, largeSpotsAvailable, this.entryPoints);
        response = `The vehicle can now park on parking spot number ${selectedSpot}`;
      }
    } else if (vehicle.vehicleType === VehicleType.M) {
      const spotsAvailable = this.parkingLot.filter(v => v.size === (ParkingSlotType.LP || ParkingSlotType.MP ) && v.isVacant);
      if (spotsAvailable.length > 1) {
        response = 'The parking for MEDIUM vehicle is full';
      } else {
        const selectedSpot = this.findNearestParkingSpot(vehicle.entryPoint, spotsAvailable, this.entryPoints);
        response = `The vehicle can now park on parking spot number ${selectedSpot}`;
      }
    } else {
      const spotsAvailable = this.parkingLot.filter(v => v.isVacant === true);
      const selectedSpot = this.findNearestParkingSpot(vehicle.entryPoint, spotsAvailable, this.entryPoints);
      response = `The vehicle can now park on parking spot number ${selectedSpot}`;
    }
    this.parkingStatus = response;
  }

  findNearestParkingSpot(entryPoint: string, availableSpots: ParkingSpot[], entryPoints: string[]): ParkingSpot | undefined {
    let parkingSpot: ParkingSpot | undefined;
    const index = entryPoints.findIndex(e => e === entryPoint);
    let nearestSpot = availableSpots[0].distanceFromEntrance[index];
    availableSpots.forEach(spot => {
      if (spot.distanceFromEntrance[index] > nearestSpot) {
        nearestSpot = spot.distanceFromEntrance[index];
        parkingSpot = spot;
      }
    })
    if (parkingSpot) {
      this.parkingLot.forEach(p => {
        if (p.id === parkingSpot?.id) {
          p.isVacant = false;
        }
      })
    }

    return parkingSpot;
  }

  unParkvehicle() {
    
  }

}
