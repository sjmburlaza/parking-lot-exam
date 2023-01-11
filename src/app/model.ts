export interface newVehicle {
    entryPoint: string,
    vehicleType: VehicleType | string
}

export interface oldVehicle {
    exitPoint: number,
    chargedFees: number
}

// export enum EntryPoint {
//     A,
//     B,
//     C
// }

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