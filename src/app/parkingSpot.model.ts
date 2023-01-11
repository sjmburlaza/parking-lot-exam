import { ParkingSlotType } from "./model";

export class ParkingSpot {
    public id: number;
    public size: ParkingSlotType;
    public distanceFromEntrance: number[];
    public isVacant: boolean;

    constructor(id: number, size: ParkingSlotType, distanceFromEntrance: number[], isVacant: boolean) {
        this.id = id;
        this.size = size;
        this.distanceFromEntrance = distanceFromEntrance;
        this.isVacant = isVacant;
    }
}