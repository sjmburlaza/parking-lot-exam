export interface Parking {
    id: number;
    size: ParkingSlotType | string;
    distancesFromEntrance: number[];
    isVacant: boolean;
}

export interface Vehicle {
    id: string,
    entryPoint: string,
    type: VehicleType | string,
    parkingSpot?: number,
    timeOfEntry?: Date,
    timeOfExit?: Date,
    chargedFee?: number,
    isParked?: boolean
}

export enum VehicleType {
    S = 'small',
    M = 'medium',
    L = 'large'
}

export enum ParkingSlotType {
    SP = 'small',
    MP = 'medium',
    LP = 'large'
}

export enum HourlyRate {
    SP = 20,
    MP = 60,
    LP = 100
}

export interface Entrance {
    id: string
}