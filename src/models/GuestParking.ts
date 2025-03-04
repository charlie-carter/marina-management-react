import {Car} from "./Car";
import {Temporal} from "@js-temporal/polyfill";
import {Account} from "./Account";
import {GuestParkingCharge} from "./charges/GuestParkingCharge";



export class GuestParking {
    daysParked: number;
    notes: string;
    dayArrived: Temporal.PlainDate;
    dateLeft: Temporal.PlainDate;
    gone: boolean;
    hostAccount: Account;


    constructor(
        public car: Car,
        public rate: number,
        arrived: Temporal.PlainDate,
        public onAccount: boolean,
        public paid: boolean,
        public trailer: boolean,
        account?: Account,
        notes?: string
    ) {
        this.daysParked = 1;
        this.dayArrived = arrived;
        this.gone = false;


        if (account) {
            this.hostAccount = account;
        }

        if (notes) {
            this.notes = notes;
        }
    }

    left(): void {

        this.dateLeft = this.dayArrived.add({ days: this.daysParked });

        if (!(this.paid) && this.onAccount) {
            this.chargeOutToAccount();
        } else if (this.hostAccount) {
            this.car.knownHosts.push(this.hostAccount);
        }

        if (!(this.paid)) {
            // TODO: throw warning that parking is unpaid for.
        }
        this.gone = true;
        this.car.history.push(this);
    }

    addDay(): void {
        this.daysParked++;
    }

    private chargeOutToAccount(): void {
        if (!(this.paid) && this.onAccount) {
            const parkingCharge = new GuestParkingCharge(this.parkingInfo(), this.daysParked, this.rate);
            this.hostAccount.addCharge(parkingCharge);
            this.paid = true;
            this.car.knownHosts.push(this.hostAccount);

        }
    }

    private parkingInfo(): string {
        return (
            `Car: \n ${this.car.toString()},\n` +
            `Arrived: ${this.dayArrived.toString()},\n` +
            `Left: ${this.dateLeft.toString()},\n` +
            (this.notes ? `,\nNotes: ${this.notes}` : "") +
            (this.trailer ? "With trailer" : "No trailer")
        );
    }
}
