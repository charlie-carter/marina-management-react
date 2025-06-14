// import { GuestParking } from "./GuestParking";
// import { Account } from "./Account";
import { DocumentData } from "firebase/firestore";

export class Car {
    // public history: GuestParking[] = [];
    // public knownHosts: Account[] = [];

    public ownerName: string;
    public licensePlate: string;
    public make: string;
    public colour: string;
    public model?: string;
    public contactInfo?: string;

    constructor(data: DocumentData) {
        this.ownerName = data.ownerName || "";
        this.licensePlate = data.licensePlate || "";
        this.make = data.make || "";
        this.colour = data.colour || "";
        this.model = data.model || undefined;
        this.contactInfo = data.contactInfo || undefined;
    }

    toString(): string {
        return (
            `License Plate: ${this.licensePlate}, ` +
            `Make: ${this.make}, ` +
            (this.model ? `Model: ${this.model}, ` : "") +
            `Colour: ${this.colour}, ` +
            `Owner: ${this.ownerName}` +
            (this.contactInfo ? `, Contact: ${this.contactInfo}` : "")
        );
    }
}
