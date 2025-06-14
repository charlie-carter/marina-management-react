import { Address } from "./Address";
import { Charge } from "./charges/Charge";

export class Account {
    public balance: number = 0.0;
    public charges: Charge[] = [];
    public notes: string = "";

    constructor(
        public fName: string,
        public lName: string,
        public email: string = "",
        public address: Address | null = null,
        public phone: string = ""
    ) {}

    addCharge(charge: Charge): void {
        this.balance += charge.amount;
        this.charges.push(charge);
    }

    removeCharge(index: number): void {
        if (index >= 0 && index < this.charges.length) {
            const charge = this.charges[index];
            this.balance -= charge.amount;
            this.charges.splice(index, 1);
        }
    }

    get name(): string {
        return `${this.fName} ${this.lName}`;
    }


}
