import {DocumentData, DocumentReference, Timestamp} from "firebase/firestore";



export interface CarStructure {
    colour: string;
    contactInfo: string;
    lastKnownAccount: DocumentReference;
    licensePlate: string;
    make: string;
    notes: string;
    ownerName: string;
    photoUrl: string;
    type: string;
}

export interface ParkingPaymentStructure {
    chargedDate: Timestamp;
    daysPaidFor: number;
    method: string;
}

export interface GuestParkingStructure {
    account: DocumentReference;
    carRef: DocumentReference;
    daysStayed: number;
    entryDate: Timestamp;
    exitDate: Timestamp;
    paymentInfo: ParkingPaymentStructure;
}

export interface ChargeStructure {
    id?: string;
    account: string;
    paid?: boolean;
    paidAt?: Timestamp;
    ref?: DocumentReference;
    type: string;
    amount?: number;
    link?: string;
}

export interface AccountStructure {
    id?: string;
    address?: AddressStructure
    balance?: number;
    email?: string;
    fName: string;
    lName: string;
    notes: string;
    phone?: string;
}

export interface AddressStructure {
    city: string;
    country: string;
    postalCode: string;
    province: string;
    street: string;
}

export interface OverstayedCarsStructure {
    id: string;
    car: DocumentData;
    accountName: string;
    ownerName: string;
    licensePlate: string;
    carMake: string;
    carType: string;
    daysStayed: number;
    daysPaid: number;
    status: string;
    exitDateFormatted: string;
}

export interface GuestParkingDisplay {
    accountName?: string;
    licensePlate?: string;
    carMake?: string;
    carType: string;
    carColour?: string;
    ownerName?: string;
    entryDateFormatted?: string;
    exitDateFormatted?: string;
    paymentInfo?: string;
    id: string;
}
