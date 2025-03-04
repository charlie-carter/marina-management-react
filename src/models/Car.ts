import {GuestParking} from "./GuestParking";
import {Account} from "./Account";

export class Car {
    public history: GuestParking[] = [];
    public knownHosts: Account[] = [];

    constructor(
        public ownerName: string,
        public licensePlate: string,
        public make: string,
        public colour: string,
        public model?: string,
        public contactInfo?: string
    ) {}

    toString(): string {
        return (
            `License Plate: ${this.licensePlate}, ` +
            `Make: ${this.make}, ` +
            (this.model ? `, Model: ${this.model}` : "") +
            `Colour: ${this.colour}` +
            `Owner: ${this.ownerName}, ` +
            (this.contactInfo ? `, Contact: ${this.contactInfo}` : "")
        );
    }

}
