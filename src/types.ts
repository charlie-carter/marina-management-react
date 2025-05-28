import {DocumentReference} from "firebase/firestore";
import firebase from "firebase/compat";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

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
    chargedDate: string;
    daysPaidFor: number;
    method: string;
}

export interface GuestParkingStructure {
    account: DocumentReference;
    carRef: DocumentReference;
    daysStayed: number;
    entryDate: string;
    exitDate: string;
    paymentInfo: ParkingPaymentStructure;
}

export interface ChargeStructure {
    id?: string;
    account: string;
    paid: boolean;
    paidAt?: string;
    ref: DocumentReference;
    type: string;
    amount?: number;
    link?: string;
}

export interface AccountStructure {
    address: AddressStructure
    balance: number;
    email: string;
    fName: string;
    lName: string;
    notes: string;
    phone: string;
}

export interface AddressStructure {
    city: string;
    country: string;
    postalCode: string;
    province: string;
    street: string;
}

export interface OverstayedCarsStructure {
    id: DocumentReference;
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
