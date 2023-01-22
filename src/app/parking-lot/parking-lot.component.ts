import { Component, OnInit } from '@angular/core';
import { Vehicle, ParkingSlotType, VehicleType, Parking, HourlyRate, Entrance } from '../model';
import { DialogService } from 'primeng/dynamicdialog';
// import { ConfirmationService, MessageService } from 'primeng/api';
import { ParkingService } from '../services/parking.service';

const FLAT_RATE = 40;
const DAY_RATE = 5000;
const MIN_HOURS = 3;
const HOURS_PER_DAY = 24;


@Component({
  selector: 'app-parking-lot',
  templateUrl: './parking-lot.component.html',
  styleUrls: ['./parking-lot.component.css'],
  providers: [DialogService]
})
export class ParkingLotComponent implements OnInit  {

  entryPoints: string[] = [];
  parkingLot: Parking[]  = [];
  parkedVehicles: Vehicle[] = [];
  unparkedVehicles: Vehicle[] = [];

  vehicle: Vehicle = {
    id: '',
    entryPoint: '',
    type: '',
    parkingSpot: 0,
    timeOfEntry: new Date(),
    timeOfExit: new Date(),
    chargedFee: FLAT_RATE,
    isParked: false
  };

  recordDialog: boolean = false;
  toPark: boolean = false;
  toUnpark: boolean = false;

  constructor(
    private parkingService: ParkingService,
    public dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.getParking();
    this.getEntrances();
    this.getParkedVehicles();
    this.getUnparkedVehicles();
  }

  getParking(): void {
    this.parkingService.getParking().subscribe(data => {
      this.parkingLot = data;
    })
  }

  getEntrances(): void {
    this.parkingService.getEntrances().subscribe(data => {
      const rawData: Entrance[] = data;
      console.log(rawData)
      const entrances: string[] = [];
      rawData.forEach(d => {
        entrances.push(d.id)
      })
      this.entryPoints = entrances;
    })
  }

  getParkedVehicles(): void {
    this.parkingService.getParkedVehicles().subscribe(data => {
      this.parkedVehicles = data;
    })
  }

  getUnparkedVehicles(): void {
    this.parkingService.getUnparkedVehicles().subscribe(data => {
      const rawData: Vehicle[] = data;
      const latestUnparkedVehicles: Vehicle[] = [];
      rawData.forEach(v => {
        const exitTime = v?.timeOfExit;
        if (exitTime) {
          const hoursDiff = Math.round(Math.abs(new Date().valueOf() - new Date(exitTime).valueOf()) / 36e5);
          if (hoursDiff < 1) {
            latestUnparkedVehicles.push(v);
          }
        }
      })
      this.unparkedVehicles = latestUnparkedVehicles;
    })
  }

  checkParking(vehicle: Vehicle): void {
    let response;
    if (this.parkingLot.every(parking => parking.isVacant === false)) {
      alert('The parking lot is full');
      return;
    }
    if (vehicle.type === VehicleType.L) {
      const largeSpotsAvailable = this.parkingLot.filter(v => v.size === ParkingSlotType.LP && v.isVacant === true);
      if (largeSpotsAvailable.length < 1) {
        response = 'The parking for LARGE vehicle is full';
      } else {
        const selectedSpot = this.findNearestParkingSpot(vehicle.entryPoint, largeSpotsAvailable, this.entryPoints);
        response = `The vehicle can now park on parking spot number ${selectedSpot?.id}`;
        this.vehicle.parkingSpot = selectedSpot?.id;
        this.vehicle.isParked = true;
      }
    } else if (vehicle.type === VehicleType.M) {
      const spotsAvailable = this.parkingLot.filter(v => (v.size === ParkingSlotType.LP && v.isVacant === true) || 
        (v.size === ParkingSlotType.MP && v.isVacant === true));
      if (spotsAvailable.length < 1) {
        response = 'The parking for MEDIUM vehicle is full';
      } else {
        const selectedSpot = this.findNearestParkingSpot(vehicle.entryPoint, spotsAvailable, this.entryPoints);
        response = `The vehicle can now park on parking spot number ${selectedSpot?.id}`;
        this.vehicle.parkingSpot = selectedSpot?.id;
        this.vehicle.isParked = true;
      }
    } else if (vehicle.type === VehicleType.S) {
      const spotsAvailable = this.parkingLot.filter(v => v.isVacant === true);
      const selectedSpot = this.findNearestParkingSpot(vehicle.entryPoint, spotsAvailable, this.entryPoints);
      response = `The vehicle can now park on parking spot number ${selectedSpot?.id}`;
      this.vehicle.parkingSpot = selectedSpot?.id;
      this.vehicle.isParked = true;
    }
    alert(response);
  }

  findNearestParkingSpot(entryPoint: string, availableSpots: Parking[], entryPoints: string[]): Parking | undefined{
    let parkingSpot: Parking | undefined;
    const index = entryPoints.findIndex(e => e === entryPoint);
    let nearestSpot = availableSpots[0].distancesFromEntrance[index];
    availableSpots.forEach(spot => {
      if (nearestSpot > spot.distancesFromEntrance[index]) {
        nearestSpot = spot.distancesFromEntrance[index];
        parkingSpot = spot;
      } else if (nearestSpot === spot.distancesFromEntrance[index]) {
        parkingSpot = spot;
      }
    })
    return parkingSpot;
  }

  unparkVehicle(newVehicle: Vehicle): void {
    const oldVehicle = this.parkedVehicles.find(v => v.id === newVehicle.id);
    let fees;
    if (oldVehicle) {
      fees = this.calculateFees(oldVehicle);
      let { id, entryPoint, type, parkingSpot, timeOfEntry, timeOfExit, chargedFee, isParked } = oldVehicle;
      timeOfExit = new Date();
      chargedFee = fees;
      isParked = false;
      this.parkingService.unparkVehicle(
        { id, entryPoint, type, parkingSpot, timeOfEntry, timeOfExit, chargedFee, isParked }
      ).subscribe( data => {
        console.log(data);
        this.getAll();
      });
    }
  }

  calculateFees(oldVehicle: Vehicle): number {
    let entryTime = oldVehicle.timeOfEntry;
    const exitTime = new Date();
    let hoursDiff;
    if (entryTime) {
      entryTime = new Date(entryTime)
      hoursDiff = Math.ceil(Math.abs(exitTime.valueOf() - entryTime.valueOf()) / 36e5);
    }

    const parking = this.parkingLot.find(p => p.id === oldVehicle?.parkingSpot);

    if (parking && hoursDiff && hoursDiff > MIN_HOURS && hoursDiff < HOURS_PER_DAY) {
      const remHours = hoursDiff - MIN_HOURS;
      if (parking.size === ParkingSlotType.SP) {
        return remHours * HourlyRate.SP + FLAT_RATE;
      } else if (parking.size === ParkingSlotType.MP) {
        return remHours * HourlyRate.MP + FLAT_RATE;
      } else if (parking.size === ParkingSlotType.LP) {
        return remHours * HourlyRate.LP + FLAT_RATE;
      }
    } else if (parking && hoursDiff && hoursDiff > HOURS_PER_DAY) {
      const numOfDays = Math.floor(hoursDiff/HOURS_PER_DAY);
      const totalDayRate = numOfDays * DAY_RATE;
      const remHours = hoursDiff % HOURS_PER_DAY;
      if (parking.size === ParkingSlotType.SP) {
        return (remHours * HourlyRate.SP) + totalDayRate;
      } else if (parking.size === ParkingSlotType.MP) {
        return (remHours * HourlyRate.MP) + totalDayRate;
      } else if (parking.size === ParkingSlotType.LP) {
        return (remHours * HourlyRate.LP) + totalDayRate;
      }
    }
    return FLAT_RATE;
  }

  onSubmit(): void {
    if (this.toPark) {
      this.checkParking(this.vehicle);
      const returningVehicle = this.unparkedVehicles.find(v => v.id === this.vehicle.id);
      if (returningVehicle) {
        this.vehicle['timeOfEntry'] = returningVehicle.timeOfEntry;
      }
      let selectedSpot = this.parkingLot.find(p => p.id === this.vehicle.parkingSpot);
      if (this.vehicle.isParked) {
        if (selectedSpot) {
          let { id, size, distancesFromEntrance, isVacant } = selectedSpot;
          isVacant = false;
          this.parkingService.updateParking({id, size, distancesFromEntrance, isVacant}).subscribe(data => {
            console.log(data);
            this.getAll();
          });
          this.parkingService.parkVehicle(this.vehicle).subscribe( data => {
            console.log(data);
            this.getAll();
          });
        }
      }
      this.close();
    } else if (this.toUnpark) {
      const oldVehicle = this.parkedVehicles.find(v => v.id === this.vehicle.id);
      this.unparkVehicle(this.vehicle);
      if (oldVehicle) {
        let selectedSpot = this.parkingLot.find(p => p.id === oldVehicle.parkingSpot);
        if (selectedSpot) {
          let { id, size, distancesFromEntrance, isVacant } = selectedSpot;
          isVacant = true;
          this.parkingService.updateParking({id, size, distancesFromEntrance, isVacant}).subscribe(data => {
            console.log(data);
            this.getAll();
          });
        }
      }
      this.close();
    }
  }

  doPark(): void {
    this.showDialog();
    this.toPark = true;
    this.toUnpark = false;
  }

  doUnpark(): void {
    this.showDialog();
    this.toUnpark = true;
    this.toPark = false;
  }

  showDialog(): void {
    this.recordDialog = true;
  }

  close(): void {
    this.recordDialog = false;
  }

}
