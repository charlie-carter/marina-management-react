import { Charge } from "./Charge";
import { Car } from "../Car";
import { doc, getDoc, DocumentData, DocumentReference } from "firebase/firestore";
import { db } from "../firebaseConfig"; 

export class GuestParkingCharge implements Charge {
    public price: number;
    public days: number;
    public rate: number;
    public date: string;
    public carRef: DocumentReference;  // Explicitly typed as a Firestore document reference
    public car?: Car;  // Optional property for the loaded car

    constructor(data: DocumentData) {
        this.days = data.days;
        this.rate = data.rate;
        this.price = this.days * this.rate;
        this.date = data.date;
        this.carRef = data.car; // Assuming `data.car` is a Firestore DocumentReference
    }

    async loadCar() {
        if (!this.carRef) {
            console.error("No car reference found.");
            return;
        }

        const carDoc = await getDoc(this.carRef);
        if (carDoc.exists()) {
            this.car = new Car(carDoc.data()); // Load car data into the class
        } else {
            console.error("Car document not found.");
        }
    }
}
